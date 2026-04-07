/// <reference types="bun-types" />

await Bun.build({
  entrypoints: ["./src/index.tsx", "./src/index.css"],
  outdir: "./build",
  sourcemap: "linked",
  minify: true,
  publicPath: "./",
  metafile: {
    json: "./meta.json",
    markdown: "./meta.md",
  },
});
