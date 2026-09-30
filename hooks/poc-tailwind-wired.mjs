#!/usr/bin/env node
import { findWorkspaceRoot } from "../scripts/irfp-lib.mjs";
import {
  collectPaths,
  collectText,
  findTailwindWiringIssue,
  readIfFile,
  relFromRoot,
  shouldScanTailwindWiring,
} from "../scripts/hook-policy.mjs";
import { emit, readStdinJson } from "./read-stdin.mjs";

function deny(rel, reason) {
  emit({
    permission: "deny",
    user_message: `Write blocked: ${rel} — ${reason}.`,
    agent_message:
      "Keep import \"./globals.css\" on root app/layout.tsx and @tailwind layers in app/globals.css. Retokenize :root before building screens.",
  });
}

try {
  const input = await readStdinJson();
  const root = findWorkspaceRoot();
  const textsByRel = new Map();

  for (const p of collectPaths(input)) {
    const rel = relFromRoot(root, p);
    if (!rel || rel.startsWith("..") || !shouldScanTailwindWiring(rel)) continue;
    textsByRel.set(rel, readIfFile(root, rel));
  }

  const blobs = collectText(input);
  if (!textsByRel.size && blobs.length) {
    for (const p of collectPaths(input)) {
      const rel = relFromRoot(root, p);
      if (rel && shouldScanTailwindWiring(rel)) textsByRel.set(rel, blobs.join("\n"));
    }
  } else if (textsByRel.size && blobs.length) {
    for (const [rel, existing] of textsByRel) {
      textsByRel.set(rel, `${existing}\n${blobs.join("\n")}`);
    }
  }

  for (const [rel, text] of textsByRel) {
    const issue = findTailwindWiringIssue(rel, text);
    if (issue) {
      deny(rel, issue);
      process.exit(0);
    }
  }

  emit({ permission: "allow" });
} catch (err) {
  emit({
    permission: "deny",
    user_message: "Tailwind-wiring hook failed closed.",
    agent_message: `poc-tailwind-wired error: ${err instanceof Error ? err.message : String(err)}`,
  });
}
