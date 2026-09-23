#!/usr/bin/env node
import { findRepoRoot } from "../../scripts/irfp-lib.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";
import {
  collectPaths,
  collectText,
  findExternalUrlIssue,
  readIfFile,
  relFromRoot,
  shouldScanForUrls,
} from "../../scripts/hook-policy.mjs";

function deny(rel, kind) {
  emit({
    permission: "deny",
    user_message: `Write blocked: ${rel} contains a forbidden ${kind}.`,
    agent_message:
      "Hard rule 7. Remove http(s) URLs, remote images, and next/font/google from POC UI and markdown. Use local assets or in-app routes. Do not paste the blocked URL back into chat.",
  });
}

try {
  const input = await readStdinJson();
  const root = findRepoRoot();
  const textsByRel = new Map();

  for (const p of collectPaths(input)) {
    const rel = relFromRoot(root, p);
    if (!rel || rel.startsWith("..") || !shouldScanForUrls(rel)) continue;
    textsByRel.set(rel, readIfFile(root, rel));
  }

  const blobs = collectText(input);
  if (!textsByRel.size && blobs.length) {
    for (const p of collectPaths(input)) {
      const rel = relFromRoot(root, p);
      if (rel && shouldScanForUrls(rel)) textsByRel.set(rel, blobs.join("\n"));
    }
  } else if (textsByRel.size && blobs.length) {
    for (const [rel, existing] of textsByRel) {
      textsByRel.set(rel, `${existing}\n${blobs.join("\n")}`);
    }
  }

  for (const [rel, text] of textsByRel) {
    const kind = findExternalUrlIssue(text);
    if (kind) {
      deny(rel, kind);
      process.exit(0);
    }
  }

  emit({ permission: "allow" });
} catch (err) {
  emit({
    permission: "deny",
    user_message: "External-URL hook failed closed.",
    agent_message: `no-external-urls error: ${err instanceof Error ? err.message : String(err)}`,
  });
}
