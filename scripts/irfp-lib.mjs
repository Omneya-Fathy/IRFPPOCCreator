import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const JIRA_KEY_RE = /[A-Z][A-Z0-9]+-\d+/;
export const GENERATE_PHASES = new Set(["generate", "review", "test", "push"]);

const PLUGIN_MANIFEST = ".cursor-plugin/plugin.json";
const IRFP_CONFIG = ".irfp/config.json";

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

function walkUp(start, predicate, max = 16) {
  let dir = path.resolve(start);
  for (let i = 0; i < max; i++) {
    if (predicate(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export function findPluginRoot(start = process.cwd()) {
  const fromScript = walkUp(path.dirname(fileURLToPath(import.meta.url)), (dir) =>
    fs.existsSync(path.join(dir, PLUGIN_MANIFEST)),
  );
  if (fromScript) return fromScript;

  const fromCwd = walkUp(start, (dir) => fs.existsSync(path.join(dir, PLUGIN_MANIFEST)));
  if (fromCwd) return fromCwd;

  const cfg = findIrfpConfigPath(start);
  if (cfg) {
    const data = readJson(cfg, {});
    if (data?.pluginRoot && fs.existsSync(path.join(data.pluginRoot, PLUGIN_MANIFEST))) {
      return path.resolve(data.pluginRoot);
    }
  }
  return null;
}

export function findWorkspaceRoot(start = process.cwd()) {
  const cfg = findIrfpConfigPath(start);
  if (cfg) {
    const data = readJson(cfg, {});
    if (data?.workspaceRoot && fs.existsSync(path.join(data.workspaceRoot, ".git"))) {
      return path.resolve(data.workspaceRoot);
    }
  }

  const fromGit = walkUp(start, (dir) => fs.existsSync(path.join(dir, ".git")));
  if (fromGit) return fromGit;

  const plugin = findPluginRoot(start);
  if (plugin && fs.existsSync(path.join(plugin, ".git"))) return plugin;

  return path.resolve(start);
}

function findIrfpConfigPath(start) {
  return walkUp(start, (dir) => fs.existsSync(path.join(dir, IRFP_CONFIG)));
}

export function resolveRoots(start = process.cwd()) {
  const pluginRoot = findPluginRoot(start) || findPluginRoot(path.dirname(fileURLToPath(import.meta.url)));
  const workspaceRoot = findWorkspaceRoot(start);
  if (!pluginRoot) {
    throw new Error("IRFP plugin root not found (.cursor-plugin/plugin.json). Install the plugin or run setup.");
  }
  return { pluginRoot, workspaceRoot };
}

/** @deprecated use findWorkspaceRoot */
export function findRepoRoot(start = process.cwd()) {
  return findWorkspaceRoot(start);
}

export function irfpConfigPath(workspaceRoot) {
  return path.join(workspaceRoot, IRFP_CONFIG);
}

export function parseJiraKey(title = "", body = "") {
  const fromTitle = String(title).match(JIRA_KEY_RE);
  if (fromTitle) return fromTitle[0];
  const fromBody = String(body).match(JIRA_KEY_RE);
  return fromBody ? fromBody[0] : null;
}

export function pocDir(workspaceRoot, key) {
  return path.join(workspaceRoot, "pocs", key);
}

export function runDir(workspaceRoot, key) {
  return path.join(pocDir(workspaceRoot, key), ".run");
}

export function docsDir(workspaceRoot, key) {
  return path.join(pocDir(workspaceRoot, key), "docs");
}

export function statePath(workspaceRoot, key) {
  return path.join(runDir(workspaceRoot, key), "state.json");
}

export function loadState(workspaceRoot, key) {
  return readJson(statePath(workspaceRoot, key), null);
}

export function saveState(workspaceRoot, key, patch) {
  const prev = loadState(workspaceRoot, key) || {
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
    updatedAt: null,
  };
  const next = { ...prev, ...patch, key, updatedAt: new Date().toISOString() };
  writeJson(statePath(workspaceRoot, key), next);
  return next;
}

export function listRunKeys(workspaceRoot) {
  const pocs = path.join(workspaceRoot, "pocs");
  if (!fs.existsSync(pocs)) return [];
  return fs
    .readdirSync(pocs, { withFileTypes: true })
    .filter((d) => d.isDirectory() && JIRA_KEY_RE.test(d.name))
    .map((d) => d.name);
}

export function hasAppCode(workspaceRoot, key) {
  const dir = pocDir(workspaceRoot, key);
  if (!fs.existsSync(dir)) return false;
  const skip = new Set(["docs", ".run"]);
  return fs.readdirSync(dir).some((name) => !skip.has(name));
}

const ORCHESTRATOR_PREFIXES = [
  ".cursor/",
  ".cursor-plugin/",
  "skills/",
  "agents/",
  "commands/",
  "rules/",
  "hooks/",
  "scripts/",
  "automations/",
  "templates/",
  "assets/",
  ".github/",
  "docs/",
];

export function isOrchestratorPath(relPosix) {
  const n = relPosix.replace(/\\/g, "/");
  if (n.startsWith("pocs/")) return false;
  if (ORCHESTRATOR_PREFIXES.some((p) => n === p.slice(0, -1) || n.startsWith(p))) return true;
  return ["Readme.md", "AGENTS.md", "CONTEXT.md", ".gitignore", "package.json"].includes(n);
}

/** Legacy denylist name — prefer isOrchestratorPath / isAllowedPocWriteDuringGenerate */
export function isProtectedPath(relPosix) {
  return isOrchestratorPath(relPosix);
}

export function isAllowedPocWriteDuringGenerate(relPosix, activeKeys) {
  const n = relPosix.replace(/\\/g, "/");
  if (!activeKeys.length) return true;
  for (const key of activeKeys) {
    if (n === `pocs/${key}` || n.startsWith(`pocs/${key}/`)) return true;
  }
  return false;
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

export function templatePocNext(pluginRoot) {
  return path.join(pluginRoot, "templates", "poc-next");
}

export const HOST_CLI_SHIM = `#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cfgPath = path.join(here, "..", ".irfp", "config.json");
let pluginCli = null;
try {
  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  pluginCli = path.join(cfg.pluginRoot, "scripts", "irfp.mjs");
} catch {
  console.error("Missing .irfp/config.json. Run /irfp-setup in Cursor or: node <plugin>/scripts/irfp.mjs setup");
  process.exit(1);
}
const result = spawnSync(process.execPath, [pluginCli, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status ?? 1);
`;
