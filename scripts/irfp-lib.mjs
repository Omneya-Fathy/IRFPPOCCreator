import fs from "node:fs";
import path from "node:path";

export const JIRA_KEY_RE = /[A-Z][A-Z0-9]+-\d+/;
export const GENERATE_PHASES = new Set([
  "generate",
  "review",
  "test",
  "push",
]);

export function findRepoRoot(start = process.cwd()) {
  let dir = path.resolve(start);
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, "Readme.md")) && fs.existsSync(path.join(dir, ".git"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(start);
}

export function parseJiraKey(title = "", body = "") {
  const fromTitle = String(title).match(JIRA_KEY_RE);
  if (fromTitle) return fromTitle[0];
  const fromBody = String(body).match(JIRA_KEY_RE);
  return fromBody ? fromBody[0] : null;
}

export function pocDir(root, key) {
  return path.join(root, "pocs", key);
}

export function runDir(root, key) {
  return path.join(pocDir(root, key), ".run");
}

export function docsDir(root, key) {
  return path.join(pocDir(root, key), "docs");
}

/** Canonical durable state (committed on poc/<KEY>). */
export function durableStatePath(root, key) {
  return path.join(docsDir(root, key), "run-state.json");
}

/** Older/alternate durable filenames (read-only fallback). */
export function legacyDurableStatePaths(root, key) {
  return [
    durableStatePath(root, key),
    path.join(docsDir(root, key), "state.json"),
  ];
}

export function templateRunStatePath(root) {
  return path.join(root, "templates", "poc-docs", "run-state.json");
}

/** Local mirror under gitignored .run/ for hooks and intra-run stamps. */
export function localStatePath(root, key) {
  return path.join(runDir(root, key), "state.json");
}

/** @deprecated use durableStatePath — kept for callers that expect statePath */
export function statePath(root, key) {
  return durableStatePath(root, key);
}

export function defaultState(key) {
  return {
    key,
    phase: "init",
    rfpFetched: false,
    attachments: [],
    selectedAttachments: [],
    approved: false,
    vitestPassed: false,
    branch: `poc/${key}`,
    prNumber: null,
    jiraCloudId: null,
    qaLoopCount: 0,
    humanReviewRequired: false,
    updatedAt: null,
  };
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function hasDurableState(root, key) {
  return fs.existsSync(durableStatePath(root, key));
}

export function loadDurableState(root, key) {
  return readJson(durableStatePath(root, key), null);
}

export function loadState(root, key) {
  const durable = loadDurableState(root, key);
  if (durable) return durable;
  for (const file of legacyDurableStatePaths(root, key)) {
    if (file === durableStatePath(root, key)) continue;
    const alt = readJson(file, null);
    if (alt) return alt;
  }
  const local = readJson(localStatePath(root, key), null);
  if (local) return local;
  return null;
}

/** Infer gate fields from committed docs / app tree (bootstrap legacy POCs). */
export function inferStateFromPoc(root, key) {
  const docPath = docsDir(root, key);
  const patch = {};
  const hasRfp = fs.existsSync(path.join(docPath, "rfp-brief.md"));
  const hasPlan = fs.existsSync(path.join(docPath, "task-plan.md"));
  const hasReview = fs.existsSync(path.join(docPath, "review-report.md"));
  const hasTestReport = fs.existsSync(path.join(docPath, "test-report.md"));

  if (hasRfp) {
    patch.rfpFetched = true;
    patch.phase = "analyze";
  }
  if (hasPlan) patch.phase = "plan";
  if (hasAppCode(root, key)) {
    if (!hasPlan && !hasRfp) patch.phase = "generate";
    else if (patch.phase === "plan" || patch.phase === "analyze") patch.phase = "generate";
  }
  if (hasReview) patch.phase = "review";
  if (hasTestReport) {
    try {
      const text = fs.readFileSync(path.join(docPath, "test-report.md"), "utf8");
      if (/result:\s*pass/i.test(text)) {
        patch.vitestPassed = true;
        patch.phase = "push";
      }
    } catch {
      /* ignore */
    }
  }
  return patch;
}

export function saveState(root, key, patch) {
  const prev = loadState(root, key) || defaultState(key);
  const next = {
    ...defaultState(key),
    ...prev,
    ...patch,
    key,
    updatedAt: new Date().toISOString(),
  };
  writeJson(durableStatePath(root, key), next);
  writeJson(localStatePath(root, key), next);
  return next;
}

export function listRunKeys(root) {
  const pocs = path.join(root, "pocs");
  if (!fs.existsSync(pocs)) return [];
  return fs
    .readdirSync(pocs, { withFileTypes: true })
    .filter((d) => d.isDirectory() && JIRA_KEY_RE.test(d.name))
    .map((d) => d.name);
}

export function hasAppCode(root, key) {
  const dir = pocDir(root, key);
  if (!fs.existsSync(dir)) return false;
  const skip = new Set(["docs", ".run"]);
  return fs.readdirSync(dir).some((name) => !skip.has(name));
}

export function isProtectedPath(relPosix) {
  const n = relPosix.replace(/\\/g, "/");
  if (n.startsWith("pocs/")) return false;
  const protectedPrefixes = [
    ".cursor/",
    "scripts/",
    "automations/",
    "templates/",
    ".github/",
  ];
  if (protectedPrefixes.some((p) => n === p.slice(0, -1) || n.startsWith(p))) return true;
  return [
    "Readme.md",
    "AGENTS.md",
    "CONTEXT.md",
    ".gitignore",
    "package.json",
  ].includes(n);
}

export function toPosixRel(root, abs) {
  return path.relative(root, abs).split(path.sep).join("/");
}

export function flatten(obj, out = []) {
  if (obj == null) return out;
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    out.push(String(obj));
    return out;
  }
  if (Array.isArray(obj)) {
    for (const v of obj) flatten(v, out);
    return out;
  }
  if (typeof obj === "object") {
    for (const v of Object.values(obj)) flatten(v, out);
  }
  return out;
}

export function blobIncludes(input, re) {
  return flatten(input).some((s) => re.test(s));
}

export function isDocsPath(relPosix) {
  return /^pocs\/[A-Z][A-Z0-9]+-\d+\/docs\//.test(relPosix.replace(/\\/g, "/"));
}

export function copyDir(src, dest, { skipExisting = true, skipNames = [] } = {}) {
  const skip = new Set(skipNames);
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    if (skip.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to, { skipExisting, skipNames });
      continue;
    }
    if (skipExisting && fs.existsSync(to)) continue;
    fs.copyFileSync(from, to);
  }
}

export function templatePocNext(root) {
  return path.join(root, "templates", "poc-next");
}

export function templatePocDocs(root) {
  return path.join(root, "templates", "poc-docs");
}

/** Copy planning templates into pocs/<KEY>/docs/ (skip files that already exist). */
export function copyPocDocTemplates(root, key) {
  const src = templatePocDocs(root);
  if (!fs.existsSync(src)) return { ok: false, dest: docsDir(root, key) };
  copyDir(src, docsDir(root, key), { skipExisting: true, skipNames: ["run-state.json"] });
  return { ok: true, dest: docsDir(root, key) };
}
