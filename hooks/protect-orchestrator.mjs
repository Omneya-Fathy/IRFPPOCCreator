#!/usr/bin/env node
import {
  findWorkspaceRoot,
  GENERATE_PHASES,
  isAllowedPocWriteDuringGenerate,
  listRunKeys,
  loadState,
  toPosixRel,
} from "../scripts/irfp-lib.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";

function collectPaths(input) {
  const out = [];
  const seen = new Set();
  const visit = (v) => {
    if (v == null) return;
    if (typeof v === "string") {
      if ((v.includes("/") || v.includes("\\") || /\.\w+$/.test(v)) && !seen.has(v)) {
        seen.add(v);
        out.push(v);
      }
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(visit);
      return;
    }
    if (typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (/path|file|uri|target/i.test(k)) visit(val);
        else if (typeof val === "object") visit(val);
      }
    }
  };
  visit(input);
  return out;
}

try {
  const input = await readStdinJson();
  const workspaceRoot = findWorkspaceRoot();
  const keys = listRunKeys(workspaceRoot);
  const generating = keys.filter((key) => GENERATE_PHASES.has(loadState(workspaceRoot, key)?.phase));
  if (!generating.length) {
    emit({ permission: "allow" });
    process.exit(0);
  }

  const paths = collectPaths(input);
  const blocked = paths.filter((p) => {
    const abs = p.replace(/^file:\/\//, "");
    const rel = toPosixRel(workspaceRoot, abs);
    if (!rel || rel.startsWith("..")) return false;
    return !isAllowedPocWriteDuringGenerate(rel, generating);
  });

  if (blocked.length) {
    emit({
      permission: "deny",
      user_message: "Write blocked: generated-run agents may only edit files under pocs/<JIRA-KEY>/.",
      agent_message: `Hard rule 8. Refusing path(s): ${blocked.join(", ")}. Write only under pocs/${generating[0]}/.`,
    });
    process.exit(0);
  }

  emit({ permission: "allow" });
} catch (err) {
  emit({
    permission: "allow",
    agent_message: `protect-orchestrator skipped due to parse error: ${err instanceof Error ? err.message : String(err)}`,
  });
}
