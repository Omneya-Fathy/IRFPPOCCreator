#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  copyDir,
  copyPocDocTemplates,
  docsDir,
  durableStatePath,
  findRepoRoot,
  hasAppCode,
  hasDurableState,
  inferStateFromPoc,
  listRunKeys,
  loadDurableState,
  loadState,
  parseJiraKey,
  pocDir,
  readJson,
  runDir,
  saveState,
  templatePocNext,
  templateRunStatePath,
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
  init-run                  Copy templates/poc-docs into pocs/<KEY>/docs/; write run-state.json (first start)
  ensure-run                If docs/run-state.json exists, print it; else init-run (also copies missing doc templates)
  bootstrap-state           Operator only. Never Cloud. Does not stamp approved.
  mark-rfp-fetched          Stamp that RFP attachments were downloaded (--files a,b)
  mark-selected-attachment  Record operator override filename (--files a) after listing in state
  scaffold-poc              Copy templates/poc-next into pocs/<KEY>/ (does not overwrite docs)
  set-phase                 Set run phase (--phase name)
  mark-approved             Human /approve recorded
  mark-vitest               Stamp Vitest result (--passed true|false)
  mark-pr-linked            Record GitHub PR number after create-once (--number N)
  mark-qa-round             Increment qaLoopCount after posting questions (→ In Review)
  mark-human-review         Stamp max Q&A rounds reached; human review required
  mark-qa-loop              Set qaLoopCount (--count N); operator reset after review
  status                    Print run state (docs/run-state.json)
  verify-structure          Check orchestrator files exist
  hooks-selftest            Run deny/allow checks for Q3 policy hooks
  help                      Show this text

Options:
  --key PROJ-123   --title t   --body b   --files a,b   --phase name   --passed true|false
  --number N   --branch poc/KEY   --cloud-id uuid   --count N
  --command "npx vitest run"

Durable state: pocs/<KEY>/docs/run-state.json (commit + push on poc/<KEY>).
Local mirror + RFP bytes: pocs/<KEY>/.run/ (gitignored except when mirrored for hooks).
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
  copyPocDocTemplates(root, key);
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
    const template = readJson(templateRunStatePath(root), null);
    const state = saveState(root, key, {
      ...(template && typeof template === "object" ? template : {}),
      key,
      phase: "fetch",
      rfpFetched: false,
      approved: false,
      vitestPassed: false,
      qaLoopCount: 0,
      humanReviewRequired: false,
      branch: `poc/${key}`,
    });
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "ensure-run": {
    const key = requireKey();
    ensurePocSkeleton(key);
    if (hasDurableState(root, key)) {
      const state = loadDurableState(root, key);
      const route = state?.rfpFetched ? "resume" : "start";
      console.log(
        JSON.stringify(
          {
            ...state,
            created: false,
            route,
            poc: pocDir(root, key),
            hasAppCode: hasAppCode(root, key),
            durableState: durableStatePath(root, key),
          },
          null,
          2,
        ),
      );
      break;
    }
    const template = readJson(templateRunStatePath(root), null);
    const created = saveState(root, key, {
      ...(template && typeof template === "object" ? template : {}),
      key,
      phase: "fetch",
      rfpFetched: false,
      approved: false,
      vitestPassed: false,
      qaLoopCount: 0,
      humanReviewRequired: false,
      branch: `poc/${key}`,
    });
    console.log(
      JSON.stringify(
        {
          ...created,
          created: true,
          route: "start",
          poc: pocDir(root, key),
          hasAppCode: hasAppCode(root, key),
          durableState: durableStatePath(root, key),
        },
        null,
        2,
      ),
    );
    break;
  }
  case "bootstrap-state": {
    const force = args.force === true || String(args.force) === "true";
    const keys = args.all === true || String(args.all) === "true"
      ? listRunKeys(root)
      : [requireKey()];
    if (!keys.length) fail("No POC folders under pocs/.");
    const out = [];
    for (const key of keys) {
      if (!force && fs.existsSync(durableStatePath(root, key))) {
        out.push({ key, skipped: true, reason: "run-state.json exists" });
        continue;
      }
      ensurePocSkeleton(key);
      const inferred = inferStateFromPoc(root, key);
      const state = saveState(root, key, {
        ...inferred,
        branch: `poc/${key}`,
        qaLoopCount: loadState(root, key)?.qaLoopCount ?? 0,
        humanReviewRequired: loadState(root, key)?.humanReviewRequired ?? false,
      });
      out.push({ key, skipped: false, phase: state.phase, approved: state.approved, vitestPassed: state.vitestPassed });
    }
    console.log(JSON.stringify(out, null, 2));
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
    if (!files.length) fail("Pass --files with the attachment name(s) the operator chose.");
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
  case "hooks-selftest": {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [path.join(root, "scripts", "hooks-selftest.mjs")], {
      cwd: root,
      stdio: "inherit",
    });
    process.exit(result.status ?? 1);
    break;
  }
  case "set-phase": {
    const key = requireKey();
    if (!args.phase) fail("Pass --phase <name>.");
    console.log(JSON.stringify(saveState(root, key, { phase: args.phase }), null, 2));
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
    else if (!loadState(root, key)?.branch) patch.branch = `poc/${key}`;
    if (typeof args["cloud-id"] === "string" && args["cloud-id"]) patch.jiraCloudId = args["cloud-id"];
    console.log(JSON.stringify(saveState(root, key, patch), null, 2));
    break;
  }
  case "mark-approved": {
    const key = requireKey();
    const state = saveState(root, key, { phase: "generate", approved: true });
    fs.mkdirSync(runDir(root, key), { recursive: true });
    fs.writeFileSync(
      path.join(runDir(root, key), "approved.json"),
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
  case "mark-qa-round": {
    const key = requireKey();
    ensurePocSkeleton(key);
    const prev = loadState(root, key) || { qaLoopCount: 0 };
    const current = Number(prev.qaLoopCount || 0);
    if (current >= 3) {
      fail("qaLoopCount already at max 3. Use mark-human-review; do not post another Q batch.");
    }
    const nextCount = current + 1;
    const state = saveState(root, key, {
      qaLoopCount: nextCount,
      phase: "awaiting-answers",
      humanReviewRequired: false,
    });
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "mark-human-review": {
    const key = requireKey();
    ensurePocSkeleton(key);
    const state = saveState(root, key, {
      humanReviewRequired: true,
      phase: "human-review",
    });
    console.log(JSON.stringify(state, null, 2));
    break;
  }
  case "mark-qa-loop": {
    const key = requireKey();
    ensurePocSkeleton(key);
    if (args.count == null || args.count === true) fail("Pass --count <N> (use 0 to reset after human review).");
    const count = Number(args.count);
    if (!Number.isInteger(count) || count < 0) fail("Pass --count with a non-negative integer.");
    const prev = loadState(root, key);
    const patch = { qaLoopCount: count };
    if (count === 0) {
      patch.humanReviewRequired = false;
      patch.phase = prev?.rfpFetched ? "analyze" : "fetch";
    }
    console.log(JSON.stringify(saveState(root, key, patch), null, 2));
    break;
  }
  case "status": {
    const key = requireKey();
    const state = loadState(root, key);
    if (!state) fail(`No run state for ${key}.`);
    console.log(
      JSON.stringify(
        {
          ...state,
          poc: pocDir(root, key),
          hasAppCode: hasAppCode(root, key),
          durableState: path.join(docsDir(root, key), "run-state.json"),
        },
        null,
        2,
      ),
    );
    break;
  }
  default:
    fail(`${usage()}\nUnknown command: ${cmd || "(none)"}`);
}
