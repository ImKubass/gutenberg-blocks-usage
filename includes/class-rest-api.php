<?php
declare(strict_types=1);

/**
 * REST API endpoints for Gutenberg Blocks Usage.
 *
 * Namespace: gutenberg-blocks-usage/v1
 *
 * GET /blocks          – list all unique block types used in the site.
 * GET /usage/<block>   – usage data for a specific block.
 *
 * @package Gutenberg_Blocks_Usage
 */

defined('ABSPATH') || exit;

final class GBU_Rest_Api
{

    public const stringNAMESPACE = 'gutenberg-blocks-usage/v1';

    /**
     * Register REST routes (called on 'rest_api_init').
     */
    public static function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE ,
            '/blocks',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [self::class, 'getBlocks'],
                'permission_callback' => [self::class, 'permissionsCheck'],
            ]
        );

        register_rest_route(
            self::NAMESPACE ,
            '/usage',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [self::class, 'getUsage'],
                'permission_callback' => [self::class, 'permissionsCheck'],
                'args' => [
                    'block' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                        'validate_callback' => static function (mixed $value): bool {
                            return is_string($value) && preg_match('/^[a-z0-9][a-z0-9\-]*(?:\/[a-z0-9][a-z0-9\-]*)?$/', $value) === 1;
                        },
                    ],
                ],
            ]
        );
    }

    /**
     * Only editors / admins may access these endpoints.
     */
    public static function permissionsCheck(): bool
    {
        return current_user_can('edit_posts');
    }

    /**
     * GET /blocks
     */
    public static function getBlocks(WP_REST_Request $request): WP_REST_Response|WP_HTTP_Response|WP_Error
    {
        $blocks = GBU_Block_Finder::getAllUsedBlocks();
        return rest_ensure_response($blocks);
    }

    /**
     * GET /usage?block=<block-name>
     */
    public static function getUsage(WP_REST_Request $request): WP_REST_Response|WP_HTTP_Response|WP_Error
    {
        $block = (string) $request->get_param('block');
        $data = GBU_Block_Finder::getBlockUsage($block);
        return rest_ensure_response($data);
    }
}
