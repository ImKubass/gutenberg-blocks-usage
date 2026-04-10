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
    private const string BOOTSTRAP_HANDLE = 'gbu-admin-bootstrap';

    private const string MANIFEST_FILE_PATH = 'assets/build/manifest.json';

    private static ?array $manifest = null;
    private static bool $manifestLoaded = false;

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

        $manifest = self::getManifest();


        if (!is_array($manifest)) {
            return;
        }

        $adminJs = $manifest['index.js'] ?? null;
        $adminCss = $manifest['index.css'] ?? null;


        if ($adminCss === null or $adminJs === null) {
            return;
        }

        wp_enqueue_style(
            'gbu-admin',
            GBU_PLUGIN_URL . 'assets/build/' . $adminCss,
            [],
            GBU_VERSION
        );

        wp_enqueue_script_module(
            'gbu-admin',
            GBU_PLUGIN_URL . 'assets/build/' . $adminJs,
            [],
            GBU_VERSION,
        );

        wp_set_script_translations(
            'gbu-admin',
            'gutenberg-blocks-usage',
            GBU_PLUGIN_DIR . 'languages'
        );

        // Script modules cannot be localized directly via wp_localize_script().
        // Enqueue a tiny classic script handle and inject boot data there.
        wp_register_script(self::BOOTSTRAP_HANDLE, false, [], GBU_VERSION, true);
        wp_enqueue_script(self::BOOTSTRAP_HANDLE);

        $bootData = [
            'apiBase' => esc_url_raw(rest_url('gutenberg-blocks-usage/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
        ];

        wp_add_inline_script(
            self::BOOTSTRAP_HANDLE,
            'window.GBU = ' . wp_json_encode($bootData) . ';',
            'before'
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

    private static function getManifest(): ?array
    {
        if (self::$manifestLoaded) {
            return self::$manifest;
        }

        self::$manifestLoaded = true;

        $manifestFilePath = GBU_PLUGIN_DIR . self::MANIFEST_FILE_PATH;


        if (!file_exists($manifestFilePath)) {
            return self::$manifest = null;
        }

        $manifestContent = file_get_contents($manifestFilePath);
        if ($manifestContent === false) {
            return self::$manifest = null;
        }

        $manifest = json_decode($manifestContent, true);


        return self::$manifest = is_array($manifest) ? $manifest : null;
    }
}
