import fs from "node:fs";
import path from "node:path";
import { isDocsPath, loadState, toPosixRel } from "./irfp-lib.mjs";

const JIRA_POC = /^pocs\/([A-Z][A-Z0-9]+-\d+)\//;

export const SKIP_SCAN =
  /(?:^|\/)(?:node_modules\/|\.next\/|\.run\/|package-lock\.json$|pnpm-lock\.yaml$|yarn\.lock$)/;

export const URL_SCAN_EXT = /\.(?:tsx?|jsx?|mjs|cjs|mdx?|css|html?|svg)$/i;

const PLACEHOLDER =
  /^(?:your[_-]|change[_-]?me|placeholder|example|dummy|fake|xxx|todo|<|\$\{|process\.env)/i;

const SECRET_CHECKS = [
  { id: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: "private-key-block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { id: "bearer-token", re: /\bBearer\s+[A-Za-z0-9\-._~+/]{16,}=*/ },
  { id: "sk-token", re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  {
    id: "secret-assignment",
    re: /(?:api[_-]?key|secret|password|token|connectionstring)\s*[:=]\s*['"]([^'"]{12,})['"]/gi,
  },
];

export function isDeveloperLaunch(input) {
  const t = String(input?.subagent_type || input?.subagentType || input?.agent || "").toLowerCase();
  if (t === "developer") return true;
  const blob = [
    input?.subagent_type,
    input?.subagentType,
    input?.agent,
    input?.prompt,
    input?.task,
  ]
    .filter(Boolean)
    .map((v) => String(v))
    .join("\n")
    .toLowerCase();
  return (
    /\byou are the developer\b/.test(blob) ||
    /frontend-development/.test(blob) ||
    /backend-development/.test(blob)
  );
}

export function pocKeyFromRel(relPosix) {
  const m = relPosix.replace(/\\/g, "/").match(JIRA_POC);
  return m ? m[1] : null;
}

export function jiraKeysIn(input) {
  const blob = JSON.stringify(input);
  return [...new Set([...blob.matchAll(/[A-Z][A-Z0-9]+-\d+/g)].map((m) => m[0]))];
}

export function isApproved(root, key) {
  const state = loadState(root, key);
  if (state?.approved) return true;
  const stamp = path.join(root, "pocs", key, ".run", "approved.json");
  try {
    return fs.readFileSync(stamp, "utf8").includes('"ok": true');
  } catch {
    return false;
  }
}

export function isAppPocPath(relPosix) {
  const n = relPosix.replace(/\\/g, "/");
  if (!JIRA_POC.test(n)) return false;
  if (isDocsPath(n)) return false;
  if (n.includes("/.run/")) return false;
  return true;
}

export function shouldScanForUrls(relPosix) {
  const n = relPosix.replace(/\\/g, "/");
  if (!JIRA_POC.test(n)) return false;
  if (SKIP_SCAN.test(n)) return false;
  return URL_SCAN_EXT.test(n);
}

export function shouldScanForSecrets(relPosix) {
  const n = relPosix.replace(/\\/g, "/");
  if (!JIRA_POC.test(n)) return false;
  if (SKIP_SCAN.test(n)) return false;
  if (n.includes("/.run/")) return false;
  return true;
}

export function findExternalUrlIssue(text) {
  if (!text) return null;
  if (/next\/font\/google/.test(text)) return "next/font/google";
  if (/https?:\/\//i.test(text)) return "http(s) URL";
  return null;
}

function isPlaceholderValue(value) {
  const v = String(value).trim();
  if (PLACEHOLDER.test(v)) return true;
  if (/^<[^>]+>$/.test(v)) return true;
  return false;
}

export function findSecretIssue(text) {
  if (!text) return null;
  for (const check of SECRET_CHECKS) {
    if (check.id === "secret-assignment") {
      const re = new RegExp(check.re.source, check.re.flags);
      let m;
      while ((m = re.exec(text))) {
        if (!isPlaceholderValue(m[1])) return check.id;
      }
      continue;
    }
    if (check.re.test(text)) return check.id;
  }
  if (/(?:^|\n)(?:[A-Z0-9_]*SECRET|[A-Z0-9_]*PASSWORD|[A-Z0-9_]*TOKEN|API_KEY)\s*=\s*(\S+)/.test(text)) {
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.+)$/);
      if (!m) continue;
      if (!/(SECRET|PASSWORD|TOKEN|API_KEY)/.test(m[1])) continue;
      const raw = m[2].trim().replace(/^['"]|['"]$/g, "");
      if (raw && !isPlaceholderValue(raw) && raw.length >= 8) return "env-secret";
    }
  }
  return null;
}

export function collectPaths(input) {
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

export function collectText(input) {
  const out = [];
  const visit = (v, key = "") => {
    if (v == null) return;
    if (typeof v === "string") {
      if (/content|contents|text|new_string|old_string|replacement|body|prompt/i.test(key) && v.length) {
        out.push(v);
      }
      return;
    }
    if (Array.isArray(v)) {
      v.forEach((item) => visit(item, key));
      return;
    }
    if (typeof v === "object") {
      for (const [k, val] of Object.entries(v)) visit(val, k);
    }
  };
  visit(input);
  return out;
}

export function relFromRoot(root, rawPath) {
  const abs = String(rawPath || "").replace(/^file:\/\//, "");
  if (!abs) return "";
  return toPosixRel(root, path.isAbsolute(abs) ? abs : path.join(root, abs));
}

export function readIfFile(root, rel) {
  try {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return "";
    return fs.readFileSync(abs, "utf8");
  } catch {
    return "";
  }
}
