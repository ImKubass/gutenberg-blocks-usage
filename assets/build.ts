/// <reference types="bun-types" />

import { mkdir, rm } from "node:fs/promises"
import { logBuildDiagnostics, logBuildSuccess } from "./plugins/build-logger"
import { writeManifestFromMetaFile } from "./plugins/build-manifest"
import { scssPlugin } from "./plugins/scss-plugin"

const outdir = "./build"
const manifestPath = `${outdir}/manifest.json`
const metaPath = `${outdir}/meta.json`

// Remove stale hashed chunks from previous builds.
await rm(outdir, { recursive: true, force: true })
await mkdir(outdir, { recursive: true })

const buildResult = await Bun.build({
	entrypoints: ["./src/index.tsx", "./src/index.scss"],
	outdir: outdir,
	sourcemap: "linked",
	minify: true,
	publicPath: "./",
	plugins: [scssPlugin],
	splitting: true,
	format: "esm",
	naming: "[dir]/[name]-[hash].[ext]",
	metafile: {
		json: "./meta.json",
		markdown: "./meta.md",
	},
})

logBuildDiagnostics(buildResult)

if (!buildResult.success) {
	console.error("Build failed.")
	process.exit(1)
}

await writeManifestFromMetaFile(metaPath, manifestPath)

logBuildSuccess(buildResult)
