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
            GBU_PLUGIN_URL . 'assets/css/admin.css',
            [],
            GBU_VERSION
        );

        wp_enqueue_script(
            'gbu-admin',
            GBU_PLUGIN_URL . 'assets/js/admin.js',
            [],
            GBU_VERSION,
            true
        );

        wp_localize_script(
            'gbu-admin',
            'GBU',
            [
                'apiBase' => esc_url_raw(rest_url('gutenberg-blocks-usage/v1')),
                'nonce' => wp_create_nonce('wp_rest'),
                'i18n' => [
                    'loading' => __('Loading…', 'gutenberg-blocks-usage'),
                    'select_block' => __('Select a block…', 'gutenberg-blocks-usage'),
                    'no_blocks' => __('No blocks found in the database.', 'gutenberg-blocks-usage'),
                    'no_results' => __('This block is not used anywhere.', 'gutenberg-blocks-usage'),
                    'error' => __('An error occurred. Please try again.', 'gutenberg-blocks-usage'),
                    /* translators: %d: number of posts */
                    'found_in' => __('Found in %d post(s):', 'gutenberg-blocks-usage'),
                    /* translators: %d: number of occurrences */
                    'occurrences' => __('%d occurrence(s)', 'gutenberg-blocks-usage'),
                    'edit' => __('Edit', 'gutenberg-blocks-usage'),
                    'view' => __('View', 'gutenberg-blocks-usage'),
                ],
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

            <div class="gbu-search-bar">
                <select id="gbu-block-select" disabled>
                    <option value=""><?php esc_html_e('Loading blocks…', 'gutenberg-blocks-usage'); ?></option>
                </select>
                <button id="gbu-search-btn" class="button button-primary" disabled>
                    <?php esc_html_e('Search', 'gutenberg-blocks-usage'); ?>
                </button>
            </div>

            <div id="gbu-results" class="gbu-results" aria-live="polite"></div>
        </div>
        <?php
    }
}
