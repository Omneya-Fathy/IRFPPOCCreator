import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "covers");
fs.mkdirSync(dir, { recursive: true });
const covers = [
  "river-light",
  "portland-rain",
  "cedar-walk",
  "basement-atlas",
  "hawthorne-hours",
  "shelf-notes",
];
const colors = ["#5c3d2e", "#3d5c4a", "#4a3d5c", "#5c4a3d", "#3d4a5c", "#5c523d"];
for (let i = 0; i < covers.length; i += 1) {
  const c = covers[i];
  const fill = colors[i];
  const svg = `<svg width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="${fill}"/><text x="24" y="360" fill="#faf7f2" font-family="system-ui" font-size="20">${c}</text></svg>`;
  fs.writeFileSync(path.join(dir, `${c}.svg`), svg);
}
