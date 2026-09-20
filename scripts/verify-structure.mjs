import fs from "node:fs";
import path from "node:path";

export const REQUIRED_PATHS = [
  "Readme.md",
  "AGENTS.md",
  "CONTEXT.md",
  "docs/setup.md",
  ".cursor/hooks.json",
  ".cursor/rules/irfp.mdc",
  ".cursor/agents/rfp-analyst.md",
  ".cursor/agents/requirements-planner.md",
  ".cursor/agents/developer.md",
  ".cursor/agents/reviewer.md",
  ".cursor/agents/tester.md",
  ".cursor/skills/irfp-orchestrator/SKILL.md",
  ".cursor/skills/analyze-rfp/SKILL.md",
  ".cursor/skills/generate-tasks/SKILL.md",
  ".cursor/skills/frontend-development/SKILL.md",
  ".cursor/skills/backend-development/SKILL.md",
  ".cursor/skills/irfp-code-review/SKILL.md",
  ".cursor/skills/unit-test/SKILL.md",
  ".cursor/hooks/rfp-before-analyst.mjs",
  ".cursor/hooks/vitest-before-submit.mjs",
  ".cursor/hooks/protect-orchestrator.mjs",
  "scripts/irfp.mjs",
  "scripts/irfp-lib.mjs",
  "templates/poc-docs/rfp-brief.md",
  "templates/poc-docs/ambiguity-log.md",
  "templates/poc-docs/technical-plan.md",
  "templates/poc-docs/task-plan.md",
  "templates/poc-docs/review-report.md",
  "templates/poc-docs/test-report.md",
  "templates/poc-next/package.json",
  "templates/poc-next/vitest.config.ts",
  "templates/poc-next/app/page.tsx",
  "templates/poc-next/lib/store.ts",
  "templates/poc-next/lib/store.test.ts",
  "automations/start.md",
  "automations/continue.md",
];

export function verifyStructure(root) {
  const missing = REQUIRED_PATHS.filter((rel) => !fs.existsSync(path.join(root, rel)));
  return { ok: missing.length === 0, missing };
}
