import path from "node:path"

export const scssPlugin: Bun.BunPlugin = {
	name: "scss-plugin",
	setup(build) {
		build.onLoad({ filter: /\.scss$/ }, async ({ path: filePath }) => {
			const sass = await import("sass")
			const result = await sass.compileAsync(filePath, {
				style: "compressed",
				loadPaths: [
					path.dirname(filePath),
					path.resolve(process.cwd(), "node_modules"),
				],
			})

			return {
				contents: result.css,
				loader: "css",
			}
		})
	},
}
