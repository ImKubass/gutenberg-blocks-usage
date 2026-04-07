<?php
declare(strict_types=1);

/**
 * Admin page for Gutenberg Blocks Usage.
 *
 * @package Gutenberg_Blocks_Usage
 */

defined('ABSPATH') || exit;

final class GBU_Admin_Page
{

    public const string PAGE_SLUG = 'gutenberg-blocks-usage';

    /**
     * Register the admin menu item (called on 'admin_menu').
     */
    public static function registerMenu(): void
    {
        add_menu_page(
            __('Blocks Usage', 'gutenberg-blocks-usage'),
            __('Blocks Usage', 'gutenberg-blocks-usage'),
            'edit_posts',
            self::PAGE_SLUG,
            [self::class, 'renderPage'],
            'dashicons-search',
            80
        );
    }

    /**
     * Enqueue scripts and styles for the plugin's admin page (called on 'admin_enqueue_scripts').
     *
     * @param string $hook_suffix Current admin page hook.
     */
    public static function enqueueAssets(string $hook_suffix): void
    {
        if ('toplevel_page_' . self::PAGE_SLUG !== $hook_suffix) {
            return;
        }

        wp_enqueue_style(
            'gbu-admin',
            GBU_PLUGIN_URL . 'assets/build/index.css',
            [],
            GBU_VERSION
        );

        wp_enqueue_script(
            'gbu-admin',
            GBU_PLUGIN_URL . 'assets/build/index.js',
            ['wp-i18n'],
            GBU_VERSION,
            true
        );

        wp_set_script_translations(
            'gbu-admin',
            'gutenberg-blocks-usage',
            GBU_PLUGIN_DIR . 'languages'
        );

        wp_localize_script(
            'gbu-admin',
            'GBU',
            [
                'apiBase' => esc_url_raw(rest_url('gutenberg-blocks-usage/v1')),
                'nonce' => wp_create_nonce('wp_rest'),
            ]
        );
    }

    /**
     * Render the admin page HTML shell.
     */
    public static function renderPage(): void
    {
        ?>
        <div class="wrap gbu-wrap">
            <h1><?php esc_html_e('Gutenberg Blocks Usage', 'gutenberg-blocks-usage'); ?></h1>
            <p class="description">
                <?php esc_html_e('Select a block to see where it is used across your site.', 'gutenberg-blocks-usage'); ?>
            </p>
            <div id="gbu-app-root"></div>
        </div>
        <?php
    }
}
