import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete academic research course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /Gemini Notebook 學術研究實戰/);
  assert.match(html, /研究證據包/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.match(html, /課程方法與來源/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path for exported assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");
  assert.match(html, /\/course\/notebooklm-academic\/_next\//);
  assert.match(html, /\/course\/notebooklm-academic\/og\.svg/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("og.svg", exportRoot));
});

test("ships fourteen complete units with unique bilingual videos", async () => {
  const source = await readFile(new URL("../app/course-data.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/videoId:\s*"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);
  assert.equal((source.match(/\n    phase: \d,/g) ?? []).length, 14);
  assert.equal(ids.length, 28);
  assert.equal(new Set(ids).size, 28);
  assert.equal((source.match(/\n    objectives: \[/g) ?? []).length, 14);
  assert.equal((source.match(/\n    theory: \[/g) ?? []).length, 14);
  assert.equal((source.match(/\n    exercises: \[/g) ?? []).length, 14);
  assert.equal((source.match(/checkedAt \}/g) ?? []).length, 28);
});
