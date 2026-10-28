// Run: node --test app/modules/blog/editor.test.mjs
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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
