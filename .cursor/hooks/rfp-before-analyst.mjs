#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, listRunKeys, loadState } from "../../scripts/irfp-lib.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";

const input = await readStdinJson();
const blob = JSON.stringify(input).toLowerCase();
const isAnalyst =
  /rfp analyst/.test(blob) ||
  /rfp-analyst/.test(blob) ||
  /analyze-rfp/.test(blob) ||
  /analyze rfp/.test(blob) ||
  /"rfp-analyst"/.test(blob);

if (!isAnalyst) {
  emit({ permission: "allow" });
  process.exit(0);
}

const root = findRepoRoot();
const keys = listRunKeys(root);
const ready = keys.find((key) => {
  const state = loadState(root, key);
  const stamp = path.join(root, "pocs", key, ".run", "rfp-fetched.json");
  return Boolean(state?.rfpFetched) || fs.existsSync(stamp);
});

if (!ready) {
  emit({
    permission: "deny",
    user_message: "RFP Analyst blocked: no Jira RFP attachment has been fetched for this run.",
    agent_message:
      "Stop. Run node scripts/irfp.mjs init-run --key <KEY>, download the Jira attachment, then node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>. Do not analyze without the RFP.",
  });
  process.exit(0);
}

emit({ permission: "allow" });
