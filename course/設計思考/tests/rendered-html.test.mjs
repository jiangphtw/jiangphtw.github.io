import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete design thinking course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /設計思考/);
  assert.match(html, /不急著想答案/);
  assert.match(html, /設計思考不是直線/);
  assert.match(html, /用證據說故事/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.match(html, /討論區準備中/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path for exported assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /\/course\/design-thinking\/_next\//);
  assert.match(html, /\/course\/design-thinking\/og\.png/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("og.png", exportRoot));
});

test("ships twelve complete units with unique bilingual videos", async () => {
  const source = await readFile(
    new URL("../app/course-data.ts", import.meta.url),
    "utf8",
  );
  const ids = [...source.matchAll(/videoId:\s*"([A-Za-z0-9_-]{11})"/g)].map(
    (match) => match[1],
  );

  assert.equal((source.match(/\n    phase: \d,/g) ?? []).length, 12);
  assert.equal(ids.length, 24);
  assert.equal(new Set(ids).size, 24);
  assert.equal((source.match(/\n    objectives: \[/g) ?? []).length, 12);
  assert.equal((source.match(/\n    theory: \[/g) ?? []).length, 12);
  assert.equal((source.match(/\n    exercises: \[/g) ?? []).length, 12);
  assert.equal((source.match(/checkedAt,/g) ?? []).length, 24);
});
