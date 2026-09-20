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

export function statePath(root, key) {
  return path.join(runDir(root, key), "state.json");
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

export function loadState(root, key) {
  return readJson(statePath(root, key), null);
}

export function saveState(root, key, patch) {
  const prev = loadState(root, key) || {
    key,
    phase: "init",
    rfpFetched: false,
    attachments: [],
    selectedAttachments: [],
    approved: false,
    vitestPassed: false,
    updatedAt: null,
  };
  const next = { ...prev, ...patch, key, updatedAt: new Date().toISOString() };
  writeJson(statePath(root, key), next);
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

export function copyDir(src, dest, { skipExisting = true } = {}) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to, { skipExisting });
      continue;
    }
    if (skipExisting && fs.existsSync(to)) continue;
    fs.copyFileSync(from, to);
  }
}

export function templatePocNext(root) {
  return path.join(root, "templates", "poc-next");
}
