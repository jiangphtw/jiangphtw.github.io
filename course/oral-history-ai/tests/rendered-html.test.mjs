import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete oral history course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /留下人的聲音/);
  assert.match(html, /口述歷史不是把聊天錄下來/);
  assert.match(html, /同意不是簽完一張紙/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.match(html, /原始音檔、工作副本、技術紀錄與田野日誌/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path for exported assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /\/course\/oral-history-ai\/_next\//);
  assert.match(html, /\/course\/oral-history-ai\/og\.svg/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("og.svg", exportRoot));
});

test("ships eight complete units with unique bilingual videos", async () => {
  const source = await readFile(new URL("../app/course-data.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/videoId:\s*"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);

  assert.equal((source.match(/\n    phase: \d,/g) ?? []).length, 8);
  assert.equal(ids.length, 16);
  assert.equal(new Set(ids).size, 16);
  assert.equal((source.match(/\n    objectives: \[/g) ?? []).length, 8);
  assert.equal((source.match(/\n    theory: \[/g) ?? []).length, 8);
  assert.equal((source.match(/\n    exercises: \[/g) ?? []).length, 8);
  assert.equal((source.match(/checkedAt,/g) ?? []).length, 16);
});
