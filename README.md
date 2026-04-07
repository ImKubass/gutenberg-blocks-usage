# Gutenberg Blocks Usage

A WordPress plugin that lets you find where any Gutenberg block is used across your site.

## Features

- Lists every unique Gutenberg block type currently present in the database.
- Lets editors quickly search usage of a selected block from the admin page.
- Shows post title, post type, post status, and occurrence count.
- Includes direct Edit and View links for each result row.

## Installation

1. Copy the `gutenberg-blocks-usage` folder into your WordPress `wp-content/plugins/` directory.
2. Activate the plugin in **Plugins → Installed Plugins**.
3. Navigate to **Blocks Usage** in the WordPress admin sidebar.

## Usage

1. Open **Blocks Usage** from the admin menu.
2. Wait for the dropdown to load all block types found in your database.
3. Select a block (for example `core/paragraph`).
4. Click **Search**.
5. The results table shows every post/page that uses the block, the occurrence count, and action links.

## REST API

The plugin exposes two authenticated endpoints.
Access requires the `edit_posts` capability and valid WordPress REST authentication (nonce/cookie in wp-admin).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wp-json/gutenberg-blocks-usage/v1/blocks` | Returns an array of all unique block names used in the database. |
| `GET` | `/wp-json/gutenberg-blocks-usage/v1/usage?block=<name>` | Returns `{ total, items[] }` for the given block. |

## Development (Assets)

The admin UI assets are built from TypeScript and CSS using Bun.

1. Go to the assets folder.
2. Install dependencies.
3. Build assets or run watch mode.

```bash
cd assets
bun install
bun run build
# or
bun run watch
```

Built files are generated to `assets/build/index.js` and `assets/build/index.css`.

## Requirements

- WordPress 5.8+
- PHP 8.3+
