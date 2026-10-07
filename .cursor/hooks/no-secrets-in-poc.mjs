#!/usr/bin/env node
import { execSync } from "node:child_process";
import { findRepoRoot } from "../../scripts/irfp-lib.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";
import {
  collectPaths,
  collectText,
  findSecretIssue,
  readIfFile,
  relFromRoot,
  shouldScanForSecrets,
} from "../../scripts/hook-policy.mjs";

function deny(rel, kind) {
  emit({
    permission: "deny",
    user_message: `Blocked: possible secret (${kind}) in ${rel}.`,
    agent_message:
      "Hard rule 2. Remove secrets from source, fixtures, and .env files. Use placeholders or process.env only. Do not repeat the matched value in chat or logs.",
  });
}

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

try {
  const input = await readStdinJson();
  const root = findRepoRoot();
  const command = String(input.command || input.cmd || "").trim();
  const lower = command.toLowerCase();
  const files = new Set();

  if (/\bgit\b/.test(lower) && /\b(commit|push|add)\b/.test(lower)) {
    for (const f of gitLines(root, "diff --cached --name-only --")) files.add(f);
    if (/\badd\b/.test(lower) || /\s(-a|--all)\b/.test(` ${command} `)) {
      for (const f of gitLines(root, "diff --name-only --")) files.add(f);
      for (const f of gitLines(root, "ls-files --others --exclude-standard --")) files.add(f);
    }
  }

  for (const p of collectPaths(input)) {
    const rel = relFromRoot(root, p);
    if (rel && !rel.startsWith("..")) files.add(rel);
  }

  const blobs = collectText(input);

  for (const rel of files) {
    if (!shouldScanForSecrets(rel)) continue;
    const text = `${readIfFile(root, rel)}\n${blobs.join("\n")}`;
    const kind = findSecretIssue(text);
    if (kind) {
      deny(rel, kind);
      process.exit(0);
    }
  }

  if (!files.size && blobs.length) {
    const kind = findSecretIssue(blobs.join("\n"));
    if (kind) {
      deny("(payload)", kind);
      process.exit(0);
    }
  }

  emit({ permission: "allow" });
} catch (err) {
  emit({
    permission: "deny",
    user_message: "Secret-scan hook failed closed.",
    agent_message: `no-secrets-in-poc error: ${err instanceof Error ? err.message : String(err)}`,
  });
}
