#!/usr/bin/env node
import { findRepoRoot, listRunKeys } from "../../scripts/irfp-lib.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";
import { collectPaths, isAppPocPath, isApproved, isDeveloperLaunch, jiraKeysIn, pocKeyFromRel, relFromRoot } from "../../scripts/hook-policy.mjs";

const DENY = {
  permission: "deny",
  user_message: "Developer blocked: TASK PLAN is not approved for this run.",
  agent_message:
    "Hard rule 10. Run node scripts/irfp.mjs mark-approved --key <JIRA-KEY> only after the PR author comments /approve or runs /irfp-approve. Do not generate app code first.",
};

try {
  const input = await readStdinJson();
  const root = findRepoRoot();

  if (isDeveloperLaunch(input)) {
    const mentioned = jiraKeysIn(input);
    const keys = mentioned.length ? mentioned : listRunKeys(root);
    if (!keys.length || keys.some((key) => !isApproved(root, key))) {
      emit(DENY);
      process.exit(0);
    }
    emit({ permission: "allow" });
    process.exit(0);
  }

  const appKeys = new Set();
  for (const p of collectPaths(input)) {
    const rel = relFromRoot(root, p);
    if (!rel || rel.startsWith("..")) continue;
    if (!isAppPocPath(rel)) continue;
    const key = pocKeyFromRel(rel);
    if (key) appKeys.add(key);
  }

  for (const key of appKeys) {
    if (!isApproved(root, key)) {
      emit(DENY);
      process.exit(0);
    }
  }

  emit({ permission: "allow" });
} catch (err) {
  emit({
    permission: "deny",
    user_message: "Developer approval hook failed closed.",
    agent_message: `approve-before-developer error: ${err instanceof Error ? err.message : String(err)}`,
  });
}
