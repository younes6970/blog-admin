// Run: node --test app/components/ui/button.test.mjs
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
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (specifier.startsWith(appRoot.href)) return nextResolve(`${specifier}.ts`, context);
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
const { Button } = await import("./button.tsx");

for (const loading of [false, true]) {
  test(`asChild renders one anchor with loading=${loading}`, () => {
    const html = renderToStaticMarkup(createElement(Button, { asChild: true, loading },
      createElement("a", { href: "/posts/new" }, createElement("span", null, "+"), "Create post")));
    assert.match(html, /^<a\b/);
    assert.match(html, /href="\/posts\/new"/);
    assert.match(html, /Create post/);
    assert.equal((html.match(/<a\b/g) ?? []).length, 1);
    assert.equal(html.includes("<svg"), loading);
    assert.ok(!html.includes("<button"));
  });
}
test("native loading button preserves multiple children and the spinner", () => {
  const html = renderToStaticMarkup(createElement(Button, { loading: true },
    createElement("span", null, "Save"), createElement("span", null, "post")));
  assert.match(html, /^<button\b/);
  assert.match(html, /disabled/);
  assert.match(html, /<svg/);
  assert.match(html, /Save/);
});
