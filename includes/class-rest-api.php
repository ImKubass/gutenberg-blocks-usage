<?php
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

defined( 'ABSPATH' ) || exit;

class GBU_Rest_Api {

	const NAMESPACE = 'gutenberg-blocks-usage/v1';

	/**
	 * Register REST routes (called on 'init').
	 */
	public static function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/blocks',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_blocks' ),
				'permission_callback' => array( __CLASS__, 'permissions_check' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/usage',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_usage' ),
				'permission_callback' => array( __CLASS__, 'permissions_check' ),
				'args'                => array(
					'block' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'validate_callback' => function ( $value ) {
							return (bool) preg_match( '/^[a-z0-9][a-z0-9\-]*(?:\/[a-z0-9][a-z0-9\-]*)?$/', $value );
						},
					),
				),
			)
		);
	}

	/**
	 * Only editors / admins may access these endpoints.
	 */
	public static function permissions_check() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * GET /blocks
	 */
	public static function get_blocks( WP_REST_Request $request ) {
		$blocks = GBU_Block_Finder::get_all_used_blocks();
		return rest_ensure_response( $blocks );
	}

	/**
	 * GET /usage?block=<block-name>
	 */
	public static function get_usage( WP_REST_Request $request ) {
		$block = $request->get_param( 'block' );
		$data  = GBU_Block_Finder::get_block_usage( $block );
		return rest_ensure_response( $data );
	}
}
