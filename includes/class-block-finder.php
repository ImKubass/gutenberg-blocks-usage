<?php
/**
 * Block Finder – queries the database for Gutenberg block usage.
 *
 * @package Gutenberg_Blocks_Usage
 */

defined( 'ABSPATH' ) || exit;

class GBU_Block_Finder {

	/**
	 * Post statuses that are considered "active" content.
	 */
	const ACTIVE_STATUSES = array( 'publish', 'draft', 'private', 'pending' );

	/**
	 * Post types to exclude from every query.
	 */
	const EXCLUDED_POST_TYPES = array( 'revision', 'attachment', 'nav_menu_item' );

	/**
	 * Return a sorted list of every unique block type used in the database.
	 *
	 * @return string[] E.g. ['core/paragraph', 'brilo/text-and-media', …]
	 */
	public static function get_all_used_blocks() {
		global $wpdb;

		$statuses      = self::ACTIVE_STATUSES;
		$status_in     = implode( ', ', array_fill( 0, count( $statuses ), '%s' ) );
		$excluded      = self::EXCLUDED_POST_TYPES;
		$excluded_in   = implode( ', ', array_fill( 0, count( $excluded ), '%s' ) );

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$query = $wpdb->prepare(
			"SELECT post_content
			 FROM {$wpdb->posts}
			 WHERE post_status IN ({$status_in})
			   AND post_type NOT IN ({$excluded_in})
			   AND post_content LIKE %s",
			array_merge( $statuses, $excluded, array( '%<!-- wp:%' ) )
		);
		// phpcs:enable

		$rows = $wpdb->get_results( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		$block_names = array();
		foreach ( $rows as $row ) {
			preg_match_all( '/<!--\s+wp:([a-z0-9][a-z0-9\-]*(?:\/[a-z0-9][a-z0-9\-]*)?)[\s\/{>]/', $row->post_content, $matches );
			if ( ! empty( $matches[1] ) ) {
				foreach ( $matches[1] as $name ) {
					$block_names[ $name ] = true;
				}
			}
		}

		$result = array_keys( $block_names );
		sort( $result );
		return $result;
	}

	/**
	 * Return the count and list of posts/pages that use a specific block.
	 *
	 * @param string $block_name  Full block name, e.g. 'brilo/text-and-media'.
	 * @return array {
	 *     @type int   $total  Total number of posts containing the block.
	 *     @type array $items  Array of post data objects.
	 * }
	 */
	public static function get_block_usage( $block_name ) {
		global $wpdb;

		// Sanitise – only allow valid block-name characters.
		if ( ! preg_match( '/^[a-z0-9][a-z0-9\-]*(?:\/[a-z0-9][a-z0-9\-]*)?$/', $block_name ) ) {
			return array(
				'total' => 0,
				'items' => array(),
			);
		}

		$statuses      = self::ACTIVE_STATUSES;
		$status_in     = implode( ', ', array_fill( 0, count( $statuses ), '%s' ) );
		$excluded      = self::EXCLUDED_POST_TYPES;
		$excluded_in   = implode( ', ', array_fill( 0, count( $excluded ), '%s' ) );
		$like          = '%' . $wpdb->esc_like( '<!-- wp:' . $block_name ) . '%';

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$query = $wpdb->prepare(
			"SELECT ID, post_title, post_type, post_status, post_content
			 FROM {$wpdb->posts}
			 WHERE post_status IN ({$status_in})
			   AND post_type NOT IN ({$excluded_in})
			   AND post_content LIKE %s
			 ORDER BY post_title ASC",
			array_merge( $statuses, $excluded, array( $like ) )
		);
		// phpcs:enable

		$rows = $wpdb->get_results( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		$items = array();
		foreach ( $rows as $row ) {
			// Count exact occurrences of the block opening comment.
			$pattern     = '/<!--\s+wp:' . preg_quote( $block_name, '/' ) . '[\s\/{>]/';
			$matches     = array();
			$occurrences = preg_match_all( $pattern, $row->post_content, $matches );

			$items[] = array(
				'id'          => (int) $row->ID,
				'title'       => $row->post_title ? $row->post_title : __( '(no title)', 'gutenberg-blocks-usage' ),
				'post_type'   => $row->post_type,
				'post_status' => $row->post_status,
				'occurrences' => (int) $occurrences,
				'edit_url'    => get_edit_post_link( $row->ID, 'raw' ),
				'view_url'    => get_permalink( $row->ID ),
			);
		}

		return array(
			'total' => count( $items ),
			'items' => $items,
		);
	}
}
