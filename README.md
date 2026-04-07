# Gutenberg Blocks Usage

A WordPress plugin that lets you find where any Gutenberg block is used across your site.

## Features

- Lists every unique Gutenberg block type currently present in the database.
- Select a block from the dropdown and click **Search**.
- Displays a table with every post/page that contains the block, including:
  - Post title, type, and status
  - Number of occurrences of the block in that post
  - Direct **Edit** and **View** links

## Installation

1. Copy the `gutenberg-blocks-usage` folder into your WordPress `wp-content/plugins/` directory.
2. Activate the plugin in **Plugins → Installed Plugins**.
3. Navigate to **Blocks Usage** in the WordPress admin sidebar.

## Usage

1. Open **Blocks Usage** from the admin menu.
2. Wait for the dropdown to load all block types found in your database.
3. Select a block (e.g. `brilo/text-and-media`).
4. Click **Search**.
5. The results table shows every post/page that uses the block, the occurrence count, and action links.

## REST API

The plugin exposes two authenticated endpoints (requires `edit_posts` capability):

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wp-json/gutenberg-blocks-usage/v1/blocks` | Returns an array of all unique block names used in the database. |
| `GET` | `/wp-json/gutenberg-blocks-usage/v1/usage?block=<name>` | Returns `{ total, items[] }` for the given block. |

## Requirements

- WordPress 5.8+
- PHP 7.4+
