import { readFileSync } from "node:fs";

const requiredFiles = [
  "assets/brand/icon.svg",
  "assets/brand/logo-dark.svg",
  "assets/brand/logo-light.svg",
  "assets/brand/mark-dark.svg",
  "assets/brand/mark-light.svg",
  "assets/brand/og-image.svg",
  "docs/BRAND_ASSET_USAGE.md",
];

const read = (path) => readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const path of requiredFiles) {
  const content = read(path);
  assert(content.length > 80, `${path} is missing or unexpectedly small`);
}

for (const path of requiredFiles.filter((path) => path.endsWith(".svg"))) {
  const svg = read(path);
  assert(svg.includes("<svg"), `${path} is not SVG`);
  assert(svg.includes("viewBox="), `${path} must define a viewBox`);
  assert(svg.includes("EnteleLEDGER"), `${path} must expose the canonical brand name`);
}

const marketing = read("index.html");
assert(marketing.includes('/assets/brand/logo-dark.svg'), "marketing header must use the approved dark logo");
assert(marketing.includes('/assets/brand/og-image.svg'), "marketing metadata must use the approved social image");
assert(!marketing.includes('<span class="mark">EL</span>'), "legacy EL marketing tile must be removed");

for (const path of ["app.html", "explorer.html", "flow.html", "trust.html"]) {
  const html = read(path);
  assert(html.includes('/assets/brand/logo-light.svg'), `${path} must use the approved light logo`);
  assert(!html.includes('<span class="mark-sm">EL</span>'), `${path} must not use the legacy EL tile`);
}

const icon = read("assets/brand/icon.svg");
assert(!icon.includes("<text"), "the PWA icon must use vector geometry, not font-dependent text");

console.log("EnteleLEDGER brand integration checks passed.");

