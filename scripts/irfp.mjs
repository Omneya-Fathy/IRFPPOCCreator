#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  copyDir,
  docsDir,
  findRepoRoot,
  hasAppCode,
  loadState,
  parseJiraKey,
  pocDir,
  runDir,
  saveState,
  templatePocNext,
} from "./irfp-lib.mjs";

const root = findRepoRoot();
const [cmd, ...rest] = process.argv.slice(2);
const args = Object.fromEntries(
  rest
    .map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true] : null))
    .filter(Boolean),
);

function usage() {
  return `Usage: node scripts/irfp.mjs <command> [options]

Commands:
  parse-key                 Print first Jira key from --title then --body
  init-run                  Create pocs/<KEY>/docs and .run state
  mark-rfp-fetched          Stamp that RFP attachments were downloaded (--files a,b)
  mark-selected-attachment  Record which attachment(s) the PR author chose (--files a)
  scaffold-poc              Copy templates/poc-next into pocs/<KEY>/ (does not overwrite docs)
  set-phase                 Set run phase (--phase name)
  mark-approved             PR author /approve recorded
  mark-vitest               Stamp Vitest result (--passed true|false)
  status                    Print run state
  verify-structure          Check orchestrator files exist
  help                      Show this text

Options:
  --key PROJ-123   --title t   --body b   --files a,b   --phase name   --passed true|false
  --command "npx vitest run"
`;
}

function parseFiles() {
  return String(args.files || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function requireKey() {
  const key = args.key || parseJiraKey(args.title || "", args.body || "");
  if (!key) fail("Missing Jira key. Pass --key PROJ-123 or --title / --body.");
  return key;
}

function ensurePocSkeleton(key) {
  fs.mkdirSync(docsDir(root, key), { recursive: true });
  fs.mkdirSync(runDir(root, key), { recursive: true });
  const gitkeep = path.join(docsDir(root, key), ".gitkeep");
  if (!fs.existsSync(gitkeep) && fs.readdirSync(docsDir(root, key)).length === 0) {
    fs.writeFileSync(gitkeep, "");
  }
}

switch (cmd) {
  case "help":
  case "--help":
  case "-h": {
    console.log(usage());
    break;
  }
  case "parse-key": {
    const key = parseJiraKey(args.title || "", args.body || "");
    if (!key) fail("No Jira key found in title or body.");
    console.log(key);
    break;
  }
  case "init-run": {
    const key = requireKey();
    ensurePocSkeleton(key);
    const state = saveState(root, key, { phase: "fetch", rfpFetched: false, approved: false, vitestPassed: false });
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "mark-rfp-fetched": {
    const key = requireKey();
    ensurePocSkeleton(key);
    const files = parseFiles();
    if (!files.length) fail("Pass --files name1,name2 of Jira attachments that were downloaded.");
    const dest = path.join(runDir(root, key), "rfp");
    fs.mkdirSync(dest, { recursive: true });
    const state = saveState(root, key, {
      phase: "analyze",
      rfpFetched: true,
      attachments: files,
      selectedAttachments: files.length === 1 ? files : [],
    });
    fs.writeFileSync(
      path.join(runDir(root, key), "rfp-fetched.json"),
      `${JSON.stringify({ ok: true, files, at: state.updatedAt }, null, 2)}\n`,
    );
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "mark-selected-attachment": {
    const key = requireKey();
    const files = parseFiles();
    if (!files.length) fail("Pass --files with the attachment name(s) the PR author chose.");
    const state = loadState(root, key);
    const known = state?.attachments || [];
    const unknown = files.filter((f) => known.length && !known.includes(f));
    if (unknown.length) fail(`Attachment not in fetched list: ${unknown.join(", ")}`);
    console.log(
      JSON.stringify(
        saveState(root, key, {
          selectedAttachments: files,
          rfpFetched: true,
          phase: state?.phase === "fetch" ? "analyze" : state?.phase,
        }),
        null,
        2,
      ),
    );
    break;
  }
  case "scaffold-poc": {
    const key = requireKey();
    ensurePocSkeleton(key);
    const src = templatePocNext(root);
    if (!fs.existsSync(src)) fail(`Missing template at ${src}`);
    copyDir(src, pocDir(root, key), { skipExisting: true });
    console.log(JSON.stringify({ ok: true, dest: pocDir(root, key) }, null, 2));
    break;
  }
  case "verify-structure": {
    const { verifyStructure } = await import("./verify-structure.mjs");
    const result = verifyStructure(root);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    break;
  }
  case "set-phase": {
    const key = requireKey();
    if (!args.phase) fail("Pass --phase <name>.");
    console.log(JSON.stringify(saveState(root, key, { phase: args.phase }), null, 2));
    break;
  }
  case "mark-approved": {
    const key = requireKey();
    console.log(
      JSON.stringify(saveState(root, key, { phase: "generate", approved: true }), null, 2),
    );
    break;
  }
  case "mark-vitest": {
    const key = requireKey();
    const passed = String(args.passed ?? "true") !== "false";
    const report = args.report || "";
    const stamp = {
      ok: passed,
      at: new Date().toISOString(),
      command: args.command || "npx vitest run",
      report,
    };
    fs.mkdirSync(runDir(root, key), { recursive: true });
    fs.writeFileSync(
      path.join(runDir(root, key), "vitest-pass.json"),
      `${JSON.stringify(stamp, null, 2)}\n`,
    );
    const state = saveState(root, key, {
      phase: passed ? "push" : "test",
      vitestPassed: passed,
    });
    if (!passed) fail("Vitest did not pass.");
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "status": {
    const key = requireKey();
    const state = loadState(root, key);
    if (!state) fail(`No run state for ${key}.`);
    console.log(
      JSON.stringify({ ...state, poc: pocDir(root, key), hasAppCode: hasAppCode(root, key) }, null, 2),
    );
    break;
  }
  default:
    fail(`${usage()}\nUnknown command: ${cmd || "(none)"}`);
}
