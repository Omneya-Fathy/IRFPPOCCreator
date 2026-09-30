#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  copyDir,
  docsDir,
  findPluginRoot,
  findWorkspaceRoot,
  hasAppCode,
  HOST_CLI_SHIM,
  irfpConfigPath,
  loadState,
  parseJiraKey,
  pocDir,
  resolveRoots,
  runDir,
  saveState,
  templatePocNext,
  writeJson,
} from "./irfp-lib.mjs";

function getRoots() {
  try {
    return resolveRoots();
  } catch {
    const workspaceRoot = findWorkspaceRoot();
    const pluginRoot = findPluginRoot() || workspaceRoot;
    return { pluginRoot, workspaceRoot };
  }
}

const { pluginRoot, workspaceRoot } = getRoots();
const [cmd, ...rest] = process.argv.slice(2);
const args = Object.fromEntries(
  rest
    .map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true] : null))
    .filter(Boolean),
);

function usage() {
  return `Usage: node scripts/irfp.mjs <command> [options]

Commands:
  setup                     Write .irfp/config.json and host CLI shim (any host repo)
  parse-key                 Print first Jira key from --title then --body
  init-run                  Create pocs/<KEY>/docs and .run state
  mark-rfp-fetched          Stamp that RFP attachments were downloaded (--files a,b)
  mark-selected-attachment  Record operator override filename (--files a) after listing in state
  scaffold-poc              Copy templates/poc-next into pocs/<KEY>/ (does not overwrite docs)
  set-phase                 Set run phase (--phase name)
  mark-approved             Human /approve recorded
  mark-vitest               Stamp Vitest result (--passed true|false)
  mark-pr-linked            Record GitHub PR number after create-once (--number N)
  status                    Print run state
  verify-structure          Check plugin files exist
  hooks-selftest            Run deny/allow checks for Q3 policy hooks
  help                      Show this text

Options:
  --key PROJ-123   --title t   --body b   --files a,b   --phase name   --passed true|false
  --number N   --branch poc/KEY   --cloud-id uuid
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
  fs.mkdirSync(docsDir(workspaceRoot, key), { recursive: true });
  fs.mkdirSync(runDir(workspaceRoot, key), { recursive: true });
  const gitkeep = path.join(docsDir(workspaceRoot, key), ".gitkeep");
  if (!fs.existsSync(gitkeep) && fs.readdirSync(docsDir(workspaceRoot, key)).length === 0) {
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
  case "setup": {
    const roots = resolveRoots();
    const cfg = { pluginRoot: roots.pluginRoot, workspaceRoot: roots.workspaceRoot };
    writeJson(irfpConfigPath(roots.workspaceRoot), cfg);
    const shimPath = path.join(roots.workspaceRoot, "scripts", "irfp.mjs");
    const pluginCli = path.join(roots.pluginRoot, "scripts", "irfp.mjs");
    if (path.resolve(shimPath) !== path.resolve(pluginCli)) {
      fs.mkdirSync(path.dirname(shimPath), { recursive: true });
      fs.writeFileSync(shimPath, HOST_CLI_SHIM, "utf8");
    }
    const agents = path.join(roots.workspaceRoot, "AGENTS.md");
    const template = path.join(roots.pluginRoot, "templates", "AGENTS.md");
    if (!fs.existsSync(agents) && fs.existsSync(template)) {
      fs.copyFileSync(template, agents);
    }
    console.log(JSON.stringify({ ok: true, ...cfg }, null, 2));
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
    const state = saveState(workspaceRoot, key, {
      phase: "fetch",
      rfpFetched: false,
      approved: false,
      vitestPassed: false,
      branch: `poc/${key}`,
    });
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "mark-rfp-fetched": {
    const key = requireKey();
    ensurePocSkeleton(key);
    const files = parseFiles();
    if (!files.length) fail("Pass --files name1,name2 of Jira attachments that were downloaded.");
    const dest = path.join(runDir(workspaceRoot, key), "rfp");
    fs.mkdirSync(dest, { recursive: true });
    const state = saveState(workspaceRoot, key, {
      phase: "analyze",
      rfpFetched: true,
      attachments: files,
      selectedAttachments: files.length === 1 ? files : [],
    });
    fs.writeFileSync(
      path.join(runDir(workspaceRoot, key), "rfp-fetched.json"),
      `${JSON.stringify({ ok: true, files, at: state.updatedAt }, null, 2)}\n`,
    );
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "mark-selected-attachment": {
    const key = requireKey();
    const files = parseFiles();
    if (!files.length) fail("Pass --files with the attachment name(s) the operator chose.");
    const state = loadState(workspaceRoot, key);
    const known = state?.attachments || [];
    const unknown = files.filter((f) => known.length && !known.includes(f));
    if (unknown.length) fail(`Attachment not in fetched list: ${unknown.join(", ")}`);
    console.log(
      JSON.stringify(
        saveState(workspaceRoot, key, {
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
    const src = templatePocNext(pluginRoot);
    if (!fs.existsSync(src)) fail(`Missing template at ${src}`);
    copyDir(src, pocDir(workspaceRoot, key), { skipExisting: true });
    console.log(JSON.stringify({ ok: true, dest: pocDir(workspaceRoot, key) }, null, 2));
    break;
  }
  case "verify-structure": {
    const { verifyStructure } = await import("./verify-structure.mjs");
    const result = verifyStructure(pluginRoot);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    break;
  }
  case "hooks-selftest": {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [path.join(pluginRoot, "scripts", "hooks-selftest.mjs")], {
      cwd: workspaceRoot,
      stdio: "inherit",
      env: { ...process.env, IRFP_PLUGIN_ROOT: pluginRoot },
    });
    process.exit(result.status ?? 1);
    break;
  }
  case "set-phase": {
    const key = requireKey();
    if (!args.phase) fail("Pass --phase <name>.");
    console.log(JSON.stringify(saveState(workspaceRoot, key, { phase: args.phase }), null, 2));
    break;
  }
  case "mark-pr-linked": {
    const key = requireKey();
    const numberRaw = args.number;
    if (numberRaw == null || numberRaw === true) fail("Pass --number <GitHub PR number>.");
    const prNumber = Number(numberRaw);
    if (!Number.isInteger(prNumber) || prNumber < 1) fail("Pass --number with a positive integer.");
    const patch = { prNumber };
    if (typeof args.branch === "string" && args.branch) patch.branch = args.branch;
    else if (!loadState(workspaceRoot, key)?.branch) patch.branch = `poc/${key}`;
    if (typeof args["cloud-id"] === "string" && args["cloud-id"]) patch.jiraCloudId = args["cloud-id"];
    console.log(JSON.stringify(saveState(workspaceRoot, key, patch), null, 2));
    break;
  }
  case "mark-approved": {
    const key = requireKey();
    const state = saveState(workspaceRoot, key, { phase: "generate", approved: true });
    fs.mkdirSync(runDir(workspaceRoot, key), { recursive: true });
    fs.writeFileSync(
      path.join(runDir(workspaceRoot, key), "approved.json"),
      `${JSON.stringify({ ok: true, at: state.updatedAt }, null, 2)}\n`,
    );
    console.log(JSON.stringify(state, null, 2));
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
    fs.mkdirSync(runDir(workspaceRoot, key), { recursive: true });
    fs.writeFileSync(
      path.join(runDir(workspaceRoot, key), "vitest-pass.json"),
      `${JSON.stringify(stamp, null, 2)}\n`,
    );
    const state = saveState(workspaceRoot, key, {
      phase: passed ? "push" : "test",
      vitestPassed: passed,
    });
    if (!passed) fail("Vitest did not pass.");
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "status": {
    const key = requireKey();
    const state = loadState(workspaceRoot, key);
    if (!state) fail(`No run state for ${key}.`);
    console.log(
      JSON.stringify(
        { ...state, poc: pocDir(workspaceRoot, key), hasAppCode: hasAppCode(workspaceRoot, key) },
        null,
        2,
      ),
    );
    break;
  }
  default:
    fail(`${usage()}\nUnknown command: ${cmd || "(none)"}`);
}
