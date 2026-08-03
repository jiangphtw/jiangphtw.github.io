import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete operations research course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /作業研究/);
  assert.match(html, /把限制說清楚/);
  assert.match(html, /先問對決策/);
  assert.match(html, /零和賽局與混合策略/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.match(html, /討論區準備中/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path for exported assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /\/course\/operations-research\/_next\//);
  assert.match(html, /\/course\/operations-research\/og\.svg/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("og.svg", exportRoot));
});

test("ships fifteen complete units with unique bilingual videos", async () => {
  const source = await readFile(new URL("../app/course-data.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/videoId:\s*"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);

  assert.equal((source.match(/\border:\s*"\d{2}"/g) ?? []).length, 15);
  assert.equal(ids.length, 30);
  assert.equal(new Set(ids).size, 30);
  assert.equal((source.match(/\bobjectives:\s*\[\s*"/g) ?? []).length, 15);
  assert.equal((source.match(/\btheory:\s*\[\s*"/g) ?? []).length, 15);
  assert.equal((source.match(/\bexercises:\s*\[\s*"/g) ?? []).length, 15);
  assert.equal((source.match(/checkedAt,/g) ?? []).length, 30);
});
