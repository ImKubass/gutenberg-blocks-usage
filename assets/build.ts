/// <reference types="bun-types" />

import { mkdir, rm } from "node:fs/promises"
import { basename, extname, relative } from "node:path"
import { scssPlugin } from "./plugins/scss-plugin"

const outdir = "./build"
const manifestPath = `${outdir}/manifest.json`
const metaPath = `${outdir}/meta.json`

const colors = {
	reset: "\x1b[0m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	cyan: "\x1b[36m",
} as const

const colorize = (color: keyof typeof colors, text: string) =>
	`${colors[color]}${text}${colors.reset}`

type BuildLog = {
	level?: string
	message?: string
}

type MetafileOutput = {
	entryPoint?: string
}

type Metafile = {
	outputs?: Record<string, MetafileOutput>
}

const normalizeLogMessage = (log: unknown): string => {
	if (typeof log === "string") {
		return log
	}

	if (log && typeof log === "object") {
		const maybeMessage = (log as BuildLog).message
		if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
			return maybeMessage
		}

		try {
			return JSON.stringify(log)
		} catch {
			return "Unknown build log"
		}
	}

	return "Unknown build log"
}

const getLogLevel = (log: unknown): string => {
	if (!log || typeof log !== "object") {
		return ""
	}

	const level = (log as BuildLog).level

	return typeof level === "string" ? level.toLowerCase() : ""
}

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

const logs = buildResult.logs ?? []
const warningLogs = logs.filter((log) => getLogLevel(log).includes("warn"))
const errorLogs = logs.filter((log) => getLogLevel(log).includes("error"))

if (warningLogs.length > 0) {
	console.warn(colorize("yellow", `Warnings (${warningLogs.length}):`))
	for (const warning of warningLogs) {
		console.warn(colorize("yellow", `- ${normalizeLogMessage(warning)}`))
	}
}

if (errorLogs.length > 0) {
	console.error(colorize("red", `Errors (${errorLogs.length}):`))
	for (const error of errorLogs) {
		console.error(colorize("red", `- ${normalizeLogMessage(error)}`))
	}
}

if (!buildResult.success) {
	console.error(colorize("red", "Build failed."))
	process.exit(1)
}

const metaRaw = await Bun.file(metaPath).text()
const metafile = JSON.parse(metaRaw) as Metafile
const manifest: Record<string, string> = {}

for (const [outputPath, outputData] of Object.entries(metafile.outputs ?? {})) {
	if (!outputData.entryPoint) {
		continue
	}

	const cleanOutputPath = outputPath.replace(/\\/g, "/").replace(/^(\.\/)+/, "")
	const entryBase = basename(
		outputData.entryPoint,
		extname(outputData.entryPoint),
	)
	const outputExt = extname(cleanOutputPath)
	const key = `${entryBase}${outputExt}`

	manifest[key] = cleanOutputPath
}

await Bun.write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

const builtFiles = buildResult.outputs
	.map((output) => relative(process.cwd(), output.path).replace(/\\/g, "/"))
	.sort()

console.log(colorize("green", `Build OK (${builtFiles.length} files)`))
for (const filePath of builtFiles) {
	console.log(colorize("cyan", `- ${filePath}`))
}
