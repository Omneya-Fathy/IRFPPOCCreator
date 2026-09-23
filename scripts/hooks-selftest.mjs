#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, saveState } from "./irfp-lib.mjs";
import { findExternalUrlIssue, findSecretIssue, isDeveloperLaunch } from "./hook-policy.mjs";

const root = findRepoRoot();

function runHook(script, payload) {
  const result = spawnSync(process.execPath, [path.join(root, ".cursor", "hooks", script)], {
    cwd: root,
    encoding: "utf8",
    input: JSON.stringify(payload),
  });
  const line = (result.stdout || "").trim().split(/\r?\n/).filter(Boolean).pop() || "{}";
  let json = {};
  try {
    json = JSON.parse(line);
  } catch {
    json = { parseError: line, stderr: result.stderr };
  }
  return { json, status: result.status, stderr: result.stderr };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`fail  ${name}: ${err instanceof Error ? err.message : err}`);
  }
}

check("policy: developer launch detection", () => {
  assert(isDeveloperLaunch({ subagent_type: "developer" }), "subagent_type developer");
  assert(isDeveloperLaunch({ prompt: "You are the Developer. Jira key: X-1." }), "prompt stem");
  assert(isDeveloperLaunch({ prompt: "Follow frontend-development after approve" }), "prompt skill");
  assert(!isDeveloperLaunch({ subagent_type: "reviewer", prompt: "after Developer work" }), "reviewer false positive");
  assert(
    !isDeveloperLaunch({
      tool: "Write",
      path: "AGENTS.md",
      contents: "see frontend-development SKILL.md",
    }),
    "file contents are not a launch",
  );
});

check("policy: URL scan", () => {
  assert(findExternalUrlIssue('href="https://example.com"') === "http(s) URL", "https");
  assert(findExternalUrlIssue('import { Inter } from "next/font/google"') === "next/font/google", "font");
  assert(findExternalUrlIssue('href="/about"') == null, "local route");
});

check("policy: secret scan does not echo values", () => {
  assert(findSecretIssue("const k = 'sk-abcdefghijklmnopqrstuvwxyz'") === "sk-token", "sk");
  assert(findSecretIssue("api_key: process.env.API_KEY") == null, "placeholder env");
  assert(findSecretIssue("password: 'CHANGE_ME_PLEASE'") == null, "placeholder assignment");
  assert(findSecretIssue("password: 'literal-production-pass'") === "secret-assignment", "literal");
});

const key = `HOOK-${Date.now()}`;
const poc = path.join(root, "pocs", key);
fs.mkdirSync(path.join(poc, "docs"), { recursive: true });
fs.mkdirSync(path.join(poc, ".run"), { recursive: true });
saveState(root, key, { phase: "plan", approved: false });

try {
  check("approve: deny developer without stamp", () => {
    const { json } = runHook("approve-before-developer.mjs", {
      subagent_type: "developer",
      prompt: `You are the Developer. Jira key: ${key}.`,
    });
    assert(json.permission === "deny", `expected deny, got ${JSON.stringify(json)}`);
  });

  check("approve: allow docs write without stamp", () => {
    const { json } = runHook("approve-before-developer.mjs", {
      tool: "Write",
      path: path.join(poc, "docs", "task-plan.md"),
      contents: "# plan\n",
    });
    assert(json.permission === "allow", `expected allow, got ${JSON.stringify(json)}`);
  });

  check("approve: Write contents mentioning UI skill is not a developer launch", () => {
    const { json } = runHook("approve-before-developer.mjs", {
      tool: "Write",
      path: path.join(poc, "docs", "note.md"),
      contents: "Follow frontend-development SKILL.md for approved screens.\n",
    });
    assert(json.permission === "allow", `expected allow, got ${JSON.stringify(json)}`);
  });

  saveState(root, key, { phase: "generate", approved: true });
  fs.writeFileSync(
    path.join(poc, ".run", "approved.json"),
    `${JSON.stringify({ ok: true, at: new Date().toISOString() }, null, 2)}\n`,
  );

  check("approve: allow developer after stamp", () => {
    const { json } = runHook("approve-before-developer.mjs", {
      subagent_type: "developer",
      prompt: `You are the Developer. Jira key: ${key}.`,
    });
    assert(json.permission === "allow", `expected allow, got ${JSON.stringify(json)}`);
  });

  const tsx = path.join(poc, "app", "page.tsx");
  fs.mkdirSync(path.dirname(tsx), { recursive: true });

  check("urls: deny https in tsx payload", () => {
    const { json } = runHook("no-external-urls.mjs", {
      path: tsx,
      contents: 'export default function Page() { return <a href="https://example.com">x</a>; }',
    });
    assert(json.permission === "deny", `expected deny, got ${JSON.stringify(json)}`);
    assert(!/https:\/\/example/.test(JSON.stringify(json)), "must not echo URL");
  });

  check("urls: allow local route", () => {
    const { json } = runHook("no-external-urls.mjs", {
      path: tsx,
      contents: 'export default function Page() { return <a href="/about">x</a>; }',
    });
    assert(json.permission === "allow", `expected allow, got ${JSON.stringify(json)}`);
  });

  check("secrets: deny sk-token in fixture", () => {
    const fixture = path.join(poc, "lib", "data.ts");
    const { json } = runHook("no-secrets-in-poc.mjs", {
      path: fixture,
      contents: "export const token = 'sk-abcdefghijklmnopqrstuvwxyz';",
    });
    assert(json.permission === "deny", `expected deny, got ${JSON.stringify(json)}`);
    assert(!/sk-abcdefghijklmnopqrstuvwxyz/.test(JSON.stringify(json)), "must not echo secret");
  });

  check("secrets: allow process.env placeholder", () => {
    const fixture = path.join(poc, "lib", "data.ts");
    const { json } = runHook("no-secrets-in-poc.mjs", {
      path: fixture,
      contents: "export const token = process.env.API_KEY;",
    });
    assert(json.permission === "allow", `expected allow, got ${JSON.stringify(json)}`);
  });
} finally {
  fs.rmSync(poc, { recursive: true, force: true });
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll hook self-tests passed.");
