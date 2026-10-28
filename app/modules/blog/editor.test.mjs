// Run: node --test app/modules/blog/editor.test.mjs
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ts from "typescript";

const appRoot = new URL("../../", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("~/")) specifier = new URL(specifier.slice(2), appRoot).href;
    if (specifier.startsWith(".") && context.parentURL?.startsWith(appRoot.href)) specifier = new URL(specifier, context.parentURL).href;
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (specifier.startsWith(appRoot.href)) {
        for (const suffix of [".ts", ".tsx"]) {
          try { return nextResolve(`${specifier}${suffix}`, context); } catch {}
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (url.startsWith(appRoot.href) && url.endsWith(".tsx")) {
      const result = ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      });
      return { format: "module", source: result.outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

const { createPost, createBlock } = await import("./types.ts");
const { default: InlineBlock } = await import("./components/InlineBlock.tsx");
const { default: ContentBuilder } = await import("./components/ContentBuilder.tsx");
const { default: PostPreview } = await import("./components/PostPreview.tsx");
const { default: PostCard } = await import("./components/PostCard.tsx");
const noop = () => {};

test("inline editing renders every block type without Slot errors", () => {
  for (const type of ["heading", "paragraph", "list", "image", "link"]) {
    const html = renderToStaticMarkup(createElement(InlineBlock, { block: createBlock(type), onChange: noop }));
    assert.ok(html.length > 0);
    if (type !== "image") assert.match(html, /<textarea/);
  }
});
test("inline text is escaped rather than interpreted as HTML", () => {
  const block = { ...createBlock("paragraph"), text: '<img src=x onerror="alert(1)">' };
  const html = renderToStaticMarkup(createElement(InlineBlock, { block, onChange: noop }));
  assert.ok(!html.includes("<img"));
  assert.match(html, /&lt;img/);
});
test("empty article has an insertion target and a draggable palette", () => {
  const post = createPost();
  const html = renderToStaticMarkup(createElement(ContentBuilder, { metadata: post, blocks: [], onChange: noop, onMetadataChange: noop }));
  assert.match(html, /<article/);
  assert.match(html, /<textarea/);
  assert.match(html, /<aside/);
  assert.match(html, /aria-label="ابزار افزودن بلوک"/);
  assert.match(html, /افزودن پاراگراف|داستان را از اینجا/);
});
test("article renders saved blocks in their stored order", () => {
  const post = createPost();
  post.blocks = [{ ...createBlock("heading"), text: "FIRST_SECTION" }, { ...createBlock("paragraph"), text: "SECOND_SECTION" }];
  const html = renderToStaticMarkup(createElement(ContentBuilder, { metadata: post, blocks: post.blocks, onChange: noop, onMetadataChange: noop }));
  assert.ok(html.indexOf("FIRST_SECTION") < html.indexOf("SECOND_SECTION"));
  assert.equal((html.match(/data-block-id=/g) ?? []).length, 2);
  assert.match(html, /تنظیمات بلوک/);
});

test("insertion target identities survive repeated additions, reorders and removals", () => {
  const post = createPost();
  const renderTargets = (blocks) => {
    const html = renderToStaticMarkup(createElement(ContentBuilder, { metadata: post, blocks, onChange: noop, onMetadataChange: noop }));
    return [...html.matchAll(/data-insertion-id="([^"]+)" data-insertion-index="(\d+)"/g)].map((match) => ({ id: match[1], index: Number(match[2]) }));
  };
  assert.deepEqual(renderTargets([]), [{ id: "insert-end", index: 0 }]);
  const blocks = [];
  for (const type of ["paragraph", "heading", "list", "image", "link"]) {
    blocks.push(createBlock(type));
    const targets = renderTargets(blocks);
    assert.equal(targets.length, blocks.length + 1);
    assert.equal(new Set(targets.map((target) => target.id)).size, targets.length);
    blocks.forEach((block, index) => assert.deepEqual(targets[index], { id: `insert-before-${block.id}`, index }));
    assert.deepEqual(targets.at(-1), { id: "insert-end", index: blocks.length });
  }
  blocks.reverse();
  assert.deepEqual(renderTargets(blocks)[0], { id: `insert-before-${blocks[0].id}`, index: 0 });
  blocks.splice(1, 2);
  assert.deepEqual(renderTargets(blocks).at(-1), { id: "insert-end", index: blocks.length });
});

test("preview renders geometric list markers and a linked slim banner", () => {
  const post = createPost();
  post.blocks = [
    { ...createBlock("list"), marker: "diamond", items: ["Item"] },
    { ...createBlock("image"), size: "slim", image: { src: "https://example.com/banner.jpg", alt: "Banner" }, href: "https://example.com/destination" },
  ];
  const html = renderToStaticMarkup(createElement(PostPreview, { post }));
  assert.match(html, /list-style-type:/);
  assert.match(html, /◆/);
  assert.match(html, /aspect-\[5\/1\]/);
  assert.match(html, /href="https:\/\/example.com\/destination"/);
  assert.match(html, /rel="noopener noreferrer"/);
});

test("post cards preserve cover position, metadata and accessible management actions", () => {
  const post = { ...createPost(), title: "Card title", excerpt: "Card summary", author: "Writer", tags: ["News"], cover: { src: "https://example.com/cover.jpg", alt: "Cover", position: "top" } };
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(PostCard, { post, onDelete: noop })));
  assert.match(html, /<article/);
  assert.ok(!html.includes("<table"));
  assert.match(html, /object-position:top/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /Card title/);
  assert.match(html, /Card summary/);
  assert.match(html, /Writer/);
  assert.match(html, /News/);
  assert.match(html, /aria-label="دانلود JSON Card title"/);
  assert.match(html, /aria-label="حذف Card title"/);
  assert.ok(html.includes(`/posts/${post.id}/edit`));
});

test("post cards without an image render a stable placeholder", () => {
  const post = createPost();
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(PostCard, { post, onDelete: noop })));
  assert.ok(!html.includes("<img"));
  assert.match(html, /aspect-\[2\.2\/1\]/);
});
