#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, hasAppCode, isDocsPath, listRunKeys, loadState } from "../../scripts/irfp-lib.mjs";
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
    agent_message: "Hard rule 11: never force-push. Push commits onto the existing PR branch only.",
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

if (isCommit && !isPush) {
  const files = filesForGitCommand(root, command);
  if (allDocsOnly(files)) {
    emit({ permission: "allow" });
    process.exit(0);
  }
}

const keys = listRunKeys(root);
const blocking = [];

for (const key of keys) {
  const state = loadState(root, key);
  const app = hasAppCode(root, key);
  const generate = app || ["generate", "review", "test", "push"].includes(state?.phase);
  if (!generate) continue;
  const stamp = path.join(root, "pocs", key, ".run", "vitest-pass.json");
  const passed =
    Boolean(state?.vitestPassed) ||
    (fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8").includes('"ok": true'));
  if (!passed) blocking.push(key);
}

if (blocking.length) {
  emit({
    permission: "deny",
    user_message: `Push/commit blocked: Vitest has not passed for ${blocking.join(", ")}.`,
    agent_message:
      "Hard rule 6. Docs-only commits under pocs/<KEY>/docs/ are allowed. For app code: run Vitest then node scripts/irfp.mjs mark-vitest --key <JIRA-KEY> --passed true before git commit or git push.",
  });
  process.exit(0);
}

emit({ permission: "allow" });
