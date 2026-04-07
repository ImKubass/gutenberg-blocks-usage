<?php
declare(strict_types=1);

/**
 * Plugin Name: Gutenberg Blocks Usage
 * Plugin URI:  https://github.com/ImKubass/gutenberg-blocks-usage
 * Description: Find and list all posts/pages where a specific Gutenberg block is used.
 * Version:     1.0.0
 * Requires PHP: 8.3
 * Author:      ImKubass
 * Text Domain: gutenberg-blocks-usage
 * License:     GPL-2.0-or-later
 */

defined('ABSPATH') || exit;

define('GBU_VERSION', '1.0.0');
define('GBU_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GBU_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once GBU_PLUGIN_DIR . 'includes/class-block-finder.php';
require_once GBU_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once GBU_PLUGIN_DIR . 'includes/class-admin-page.php';

add_action('rest_api_init', ['GBU_Rest_Api', 'registerRoutes']);
add_action('admin_menu', ['GBU_Admin_Page', 'registerMenu']);
add_action('admin_enqueue_scripts', ['GBU_Admin_Page', 'enqueueAssets']);
