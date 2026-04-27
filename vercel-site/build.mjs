// Копирует resell_bot/web/static в dist, вшивает window.API_BASE (API_BASE_URL).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const staticDir = path.join(repoRoot, "resell_bot", "web", "static");
const dist = path.join(__dirname, "dist");

const adminHtml = path.join(staticDir, "admin.html");
const adminCss = path.join(staticDir, "admin.css");

if (!fs.existsSync(adminHtml)) {
  console.error("Нет файла:", adminHtml);
  process.exit(1);
}

fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(adminCss, path.join(dist, "admin.css"));

let html = fs.readFileSync(adminHtml, "utf8");
html = html.replace('href="/static/admin.css"', 'href="/admin.css"');

const apiBase = (process.env.API_BASE_URL || "").trim().replace(/\/$/, "");
const inject = `<script>window.API_BASE=${JSON.stringify(apiBase)};</script>\n`;
html = html.replace("</head>", `${inject}</head>`);

fs.writeFileSync(path.join(dist, "admin.html"), html, "utf8");

fs.writeFileSync(
  path.join(dist, "index.html"),
  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resell LZT</title>` +
    `<meta http-equiv="refresh" content="0;url=/admin.html"></head>` +
    `<body><p><a href="/admin.html">Открыть админку</a></p></body></html>`,
  "utf8",
);

console.log("dist/ готово. API_BASE_URL =", apiBase || "(пусто — задайте в Vercel перед деплоем)");
