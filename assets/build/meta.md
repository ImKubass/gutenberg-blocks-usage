# Bundle Analysis Report

This report helps identify bundle size issues, dependency bloat, and optimization opportunities.

## Table of Contents

- [Quick Summary](#quick-summary)
- [Largest Modules by Output Contribution](#largest-modules-by-output-contribution)
- [Entry Point Analysis](#entry-point-analysis)
- [Dependency Chains](#dependency-chains)
- [Full Module Graph](#full-module-graph)
- [Raw Data for Searching](#raw-data-for-searching)

---

## Quick Summary

| Metric | Value |
|--------|-------|
| Total output size | 4.38 KB |
| Input modules | 1 |
| Entry points | 2 |
| ESM modules | 1 |

## Largest Modules by Output Contribution

Modules sorted by bytes contributed to the output bundle. Large modules may indicate bloat.

| Output Bytes | % of Total | Module | Format |
|--------------|------------|--------|--------|
| 2.43 KB | 55.4% | `src/index.ts` | esm |

## Entry Point Analysis

Each entry point and the total code it loads (including shared chunks).

### Entry: `src/index.ts`

**Output file**: `./index.js`
**Bundle size**: 2.43 KB

**Bundled modules** (sorted by contribution):

| Bytes | Module |
|-------|--------|
| 2.43 KB | `src/index.ts` |

### Entry: `src/index.css`

**Output file**: `./index.css`
**Bundle size**: 1.95 KB
**Exports**: `default`

## Dependency Chains

For each module, shows what files import it. Use this to understand why a module is included.


## Full Module Graph

Complete dependency information for each module.

### `src/index.ts`

- **Output contribution**: 2.43 KB
- **Format**: esm
- **Imported by**: (entry point or orphan)

## Raw Data for Searching

This section contains raw, grep-friendly data. Use these patterns:
- `[MODULE:` - Find all modules
- `[OUTPUT_BYTES:` - Find output contribution for each module
- `[IMPORT:` - Find all import relationships
- `[IMPORTED_BY:` - Find reverse dependencies
- `[ENTRY:` - Find entry points
- `[EXTERNAL:` - Find external imports
- `[NODE_MODULES:` - Find node_modules files

### All Modules

```
[MODULE: src/index.ts]
[OUTPUT_BYTES: src/index.ts = 2426 bytes]
[FORMAT: src/index.ts = esm]
```

### All Imports

```
```

### Reverse Dependencies (Imported By)

```
```

### Entry Points

```
[ENTRY: src/index.ts -> ./index.js (2427 bytes)]
[ENTRY: src/index.css -> ./index.css (1952 bytes)]
```

