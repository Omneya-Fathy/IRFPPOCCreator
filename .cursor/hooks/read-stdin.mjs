import { stdin } from "node:process";

export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { _raw: raw };
  }
}

export function emit(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}
