#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, hasAppCode, isDocsPath, loadState } from "../../scripts/irfp-lib.mjs";
import { pocKeyFromRel } from "../../scripts/hook-policy.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";

function gitLines(root, args) {
  try {
    const out = execSync(`git ${args}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function keysFromPaths(files) {
  const keys = new Set();
  for (const f of files) {
    const k = pocKeyFromRel(f.replace(/\\/g, "/"));
    if (k) keys.add(k);
  }
  return [...keys];
}

function branchPocKey(root) {
  const branch = gitLines(root, "rev-parse --abbrev-ref HEAD")[0];
  if (!branch || branch === "HEAD") return null;
  const m = branch.match(/^poc\/([A-Za-z][A-Za-z0-9]+-\d+)$/i);
  if (!m) return null;
  const key = m[1].toUpperCase();
  const dir = path.join(root, "pocs", key);
  return fs.existsSync(dir) ? key : m[1];
}

function filesForPush(root) {
  const upstream = gitLines(root, "rev-parse --abbrev-ref --symbolic-full-name @{u}")[0];
  if (upstream) {
    const base = gitLines(root, `merge-base HEAD ${upstream}`)[0];
    if (base) return gitLines(root, `diff --name-only ${base}..HEAD`);
  }
  for (const main of ["origin/main", "origin/master", "main", "master"]) {
    const base = gitLines(root, `merge-base HEAD ${main}`)[0];
    if (base) return gitLines(root, `diff --name-only ${base}..HEAD`);
  }
  return gitLines(root, "show --name-only --pretty=format: HEAD");
}

function filesForGitCommand(root, command) {
  const cached = gitLines(root, "diff --cached --name-only --");
  if (/\s(-a|--all)\b/.test(` ${command} `)) {
    const unstaged = gitLines(root, "diff --name-only --");
    const untracked = gitLines(root, "ls-files --others --exclude-standard --");
    return [...new Set([...cached, ...unstaged, ...untracked])];
  }
  return cached;
}

function allDocsOnly(files) {
  if (!files.length) return false;
  return files.every((f) => isDocsPath(f.replace(/\\/g, "/")));
}

function touchesAppCode(files) {
  return files.some((f) => {
    const n = f.replace(/\\/g, "/");
    if (!pocKeyFromRel(n)) return false;
    return !isDocsPath(n) && !n.includes("/.run/");
  });
}

function requiresVitestGate(root, key) {
  const state = loadState(root, key);
  const app = hasAppCode(root, key);
  return app || ["generate", "review", "test", "push"].includes(state?.phase);
}

function vitestPassedForKey(root, key) {
  const state = loadState(root, key);
  const stamp = path.join(root, "pocs", key, ".run", "vitest-pass.json");
  return (
    Boolean(state?.vitestPassed) ||
    (fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8").includes('"ok": true'))
  );
}

const input = await readStdinJson();
const command = String(input.command || input.cmd || "").trim();
const lower = command.toLowerCase();

if (!/\bgit\b/.test(lower)) {
  emit({ permission: "allow" });
  process.exit(0);
}

if (/push\s+(-f|--force)\b/.test(lower) || /\b--force-with-lease\b/.test(lower)) {
  emit({
    permission: "deny",
    user_message: "Force-push is forbidden.",
    agent_message:
      "Hard rule 11: never force-push. Push onto poc/<KEY> (the PR for that key). Never open a second PR for the same Jira key.",
  });
  process.exit(0);
}

const isCommit = /\bcommit\b/.test(lower);
const isPush = /\bpush\b/.test(lower);
if (!isCommit && !isPush) {
  emit({ permission: "allow" });
  process.exit(0);
}

const root = findRepoRoot();

let scopeFiles = [];
if (isCommit && !isPush) {
  scopeFiles = filesForGitCommand(root, command);
  if (allDocsOnly(scopeFiles)) {
    emit({ permission: "allow" });
    process.exit(0);
  }
} else if (isPush) {
  scopeFiles = filesForPush(root);
}

const scopeKeys = new Set(keysFromPaths(scopeFiles));
const branchKey = branchPocKey(root);
if (branchKey) scopeKeys.add(branchKey);

if (!scopeKeys.size) {
  emit({ permission: "allow" });
  process.exit(0);
}

const blocking = [];
for (const key of scopeKeys) {
  if (!requiresVitestGate(root, key)) continue;
  if (scopeFiles.length && !touchesAppCode(scopeFiles.filter((f) => pocKeyFromRel(f.replace(/\\/g, "/")) === key))) {
    continue;
  }
  if (!vitestPassedForKey(root, key)) blocking.push(key);
}

if (blocking.length) {
  emit({
    permission: "deny",
    user_message: `Push/commit blocked: Vitest has not passed for ${blocking.join(", ")} (this operation only).`,
    agent_message:
      "Hard rule 6. Run Vitest only in the POC directory being submitted (e.g. cd pocs/<JIRA-KEY> && npx vitest run), then node scripts/irfp.mjs mark-vitest --key <JIRA-KEY> --passed true before git commit or git push. Docs-only commits under pocs/<KEY>/docs/ are allowed without Vitest. Other POC folders in the repo are not gated by this push.",
  });
  process.exit(0);
}

emit({ permission: "allow" });
