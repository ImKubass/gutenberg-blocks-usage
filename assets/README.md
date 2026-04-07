# Assets Stack

Frontend/admin assets are built with Bun from TypeScript and CSS sources.

## Stack

- Runtime + bundler: Bun
- Script entry: build.ts
- Source files: src/index.ts and src/index.css
- Output files: build/index.js and build/index.css
- Sourcemaps: linked map files in build/

## Install

Run in this folder:

```bash
bun install
```

## Build

Run in this folder:

```bash
bun run build
```

This executes the build script in package.json and produces minified files used by the plugin admin page.

## Watch

Run in this folder for automatic rebuild on file changes:

```bash
bun run watch
```

## Folder Layout

```text
src/          editable source code
build/        generated bundle artifacts (do not edit manually)
build.ts      Bun build configuration
tsconfig.json TypeScript type-checking configuration
```

## Scripts

```json
{
	"scripts": {
		"build": "bun run build.ts",
		"watch": "bun --watch run build.ts"
	}
}
```

## Notes

- The plugin enqueues assets from build/index.js and build/index.css.
- Use bun run watch during development, or run bun run build after manual changes in src/.
