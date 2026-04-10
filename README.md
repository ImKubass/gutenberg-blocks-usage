# Gutenberg Blocks Usage

WordPress plugin for finding where specific Gutenberg blocks are used across your site.

## Features

- Lists all unique block names currently present in stored post content.
- Lets users with `edit_posts` capability search usage from an admin screen.
- Shows usage details including post title, post type, status, occurrence count, and actions.
- Provides authenticated REST API endpoints for block list and usage lookup.

## Requirements

- WordPress 5.8+
- PHP 8.3+
- Logged-in user with `edit_posts` capability (for admin UI and REST access)

## Installation

1. Copy the `gutenberg-blocks-usage` folder to `wp-content/plugins/`.
2. Activate the plugin in WordPress admin under Plugins.
3. Open the **Blocks Usage** menu item in wp-admin.

## Usage

1. Open **Blocks Usage** in the admin sidebar.
2. Wait for the block selector to load.
3. Select a block name (for example `core/paragraph`).
4. Click **Search**.
5. Review matching posts/pages in the results table.

## REST API

Namespace: `gutenberg-blocks-usage/v1`

Both endpoints require:

- authenticated WordPress REST request (cookie + nonce in wp-admin context)
- user capability `edit_posts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wp-json/gutenberg-blocks-usage/v1/blocks` | Returns a list of unique block names used in content. |
| `GET` | `/wp-json/gutenberg-blocks-usage/v1/usage?block=<name>` | Returns usage summary and matching items for the requested block. |

### Request validation

- Query param `block` is required on `/usage`.
- Accepted format is validated as block-like slug, e.g. `core/paragraph`.

## Development

Admin assets are in `assets/` and built with Bun + TypeScript.

```bash
cd assets
bun install
bun run build
```

Watch mode during development:

```bash
cd assets
bun run watch
```

Useful quality checks:

```bash
cd assets
bun run lint
bun run check
```

Build output used by WordPress:

- `assets/build/index.js`
- `assets/build/index.css`

## Project Structure

```text
gutenberg-blocks-usage.php     Plugin bootstrap and hook registration
includes/                      PHP classes (admin page, finder, REST API)
assets/src/                    TypeScript/CSS source files
assets/build/                  Compiled assets enqueued in wp-admin
languages/                     Translation files
```

## License

GPL-2.0-or-later
