import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete AI investment research course", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /AI 投資研究工程/);
  assert.match(html, /別讓 AI/);
  assert.match(html, /漂亮曲線先別信/);
  assert.match(html, /可稽核的研究助理/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.match(html, /不提供個別投資建議/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");
  assert.match(html, /\/course\/ai-investment-research\/_next\//);
  assert.match(html, /\/course\/ai-investment-research\/og\.svg/);
  assert.match(html, /\/course\/ai-investment-research\/favicon\.svg/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("og.svg", exportRoot));
  await access(new URL("favicon.svg", exportRoot));
});

test("ships eight complete units with unique bilingual media", async () => {
  const source = await readFile(new URL("../app/course-data.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/videoId:\s*"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);
  assert.equal((source.match(/\n    id: \d+, phase:/g) ?? []).length, 8);
  assert.equal(ids.length, 16);
  assert.equal(new Set(ids).size, 16);
  assert.equal((source.match(/\n    objectives:/g) ?? []).length, 8);
  assert.equal((source.match(/\n    theory:/g) ?? []).length, 8);
  assert.equal((source.match(/\n    exercises:/g) ?? []).length, 8);
  assert.equal((source.match(/\n    readings:/g) ?? []).length, 8);
  assert.equal((source.match(/checkedAt,/g) ?? []).length, 16);
});
