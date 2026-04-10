/// <reference types="bun-types" />

import { scssPlugin } from "./plugins/scss-plugin"

await Bun.build({
	entrypoints: ["./src/index.tsx", "./src/index.scss"],
	outdir: "./build",
	sourcemap: "linked",
	minify: true,
	publicPath: "./",
	plugins: [scssPlugin],
	metafile: {
		json: "./meta.json",
		markdown: "./meta.md",
	},
})
