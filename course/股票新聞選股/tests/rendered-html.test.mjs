import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the completed course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /股海判讀學/);
  assert.match(html, /從資訊噪音裡/);
  assert.match(html, /三張報表，先排除地雷/);
  assert.match(html, /本單元文字教學/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path for exported assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /\/course\/stock-decision\/_next\//);
  assert.match(html, /\/course\/stock-decision\/favicon\.svg/);
  assert.match(html, /\/course\/stock-decision\/og\.png/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("favicon.svg", exportRoot));
  await access(new URL("og.png", exportRoot));
});

test("all nine units include a text lesson and cases", async () => {
  const source = await readFile(
    new URL("../app/course-data.ts", import.meta.url),
    "utf8",
  );

  assert.equal((source.match(/\n    article: \{/g) ?? []).length, 9);
  assert.equal((source.match(/\n    notebookCases: \[/g) ?? []).length, 9);
  assert.equal((source.match(/\n    eventImpacts: \[/g) ?? []).length, 1);
  assert.equal((source.match(/\n        chart: \{/g) ?? []).length, 10);
});
