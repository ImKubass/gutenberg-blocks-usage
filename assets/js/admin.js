/* global GBU */
( function () {
	'use strict';

	const api      = GBU.apiBase;
	const nonce    = GBU.nonce;
	const i18n     = GBU.i18n;

	const selectEl = document.getElementById( 'gbu-block-select' );
	const searchBtn = document.getElementById( 'gbu-search-btn' );
	const resultsEl = document.getElementById( 'gbu-results' );

	// ── Helpers ──────────────────────────────────────────────────────────

	function apiFetch( url ) {
		return fetch( url, {
			headers: {
				'X-WP-Nonce': nonce,
				Accept: 'application/json',
			},
		} ).then( function ( res ) {
			if ( ! res.ok ) {
				throw new Error( res.statusText );
			}
			return res.json();
		} );
	}

	function setLoading( loading ) {
		searchBtn.disabled = loading;
		if ( loading ) {
			resultsEl.innerHTML = '<span class="gbu-spinner" aria-hidden="true"></span>';
		}
	}

	function escHtml( str ) {
		return String( str )
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#039;' );
	}

	// ── Load block list ──────────────────────────────────────────────────

	apiFetch( api + '/blocks' )
		.then( function ( blocks ) {
			selectEl.innerHTML = '';

			if ( ! blocks.length ) {
				var placeholder = document.createElement( 'option' );
				placeholder.value   = '';
				placeholder.textContent = i18n.no_blocks;
				selectEl.appendChild( placeholder );
				return;
			}

			var placeholder = document.createElement( 'option' );
			placeholder.value   = '';
			placeholder.textContent = i18n.select_block;
			selectEl.appendChild( placeholder );

			blocks.forEach( function ( blockName ) {
				var opt = document.createElement( 'option' );
				opt.value       = blockName;
				opt.textContent = blockName;
				selectEl.appendChild( opt );
			} );

			selectEl.disabled   = false;
			searchBtn.disabled  = false;
		} )
		.catch( function () {
			selectEl.innerHTML = '<option value="">' + escHtml( i18n.error ) + '</option>';
		} );

	// ── Search ───────────────────────────────────────────────────────────

	searchBtn.addEventListener( 'click', function () {
		var blockName = selectEl.value.trim();
		if ( ! blockName ) {
			return;
		}
		runSearch( blockName );
	} );

	selectEl.addEventListener( 'keydown', function ( e ) {
		if ( e.key === 'Enter' && selectEl.value ) {
			runSearch( selectEl.value );
		}
	} );

	function runSearch( blockName ) {
		setLoading( true );

		apiFetch( api + '/usage?block=' + encodeURIComponent( blockName ) )
			.then( function ( data ) {
				renderResults( blockName, data );
			} )
			.catch( function () {
				resultsEl.innerHTML =
					'<div class="gbu-notice gbu-notice-error">' + escHtml( i18n.error ) + '</div>';
			} )
			.finally( function () {
				searchBtn.disabled = false;
			} );
	}

	// ── Render ───────────────────────────────────────────────────────────

	function renderResults( blockName, data ) {
		var html = '';

		// Summary line
		html += '<p class="gbu-results-summary">';
		html += i18n.found_in.replace(
			'%d',
			'<span class="gbu-count">' + escHtml( String( data.total ) ) + '</span>'
		);
		html += ' &nbsp; <span class="gbu-block-name">' + escHtml( blockName ) + '</span>';
		html += '</p>';

		if ( ! data.total ) {
			html += '<div class="gbu-notice gbu-notice-info">' + escHtml( i18n.no_results ) + '</div>';
			resultsEl.innerHTML = html;
			return;
		}

		html += '<table class="gbu-table">';
		html += '<thead><tr>'
			+ '<th>#</th>'
			+ '<th>Title</th>'
			+ '<th>Type</th>'
			+ '<th>Status</th>'
			+ '<th>Occurrences</th>'
			+ '<th>Actions</th>'
			+ '</tr></thead>';
		html += '<tbody>';

		data.items.forEach( function ( item, index ) {
			var statusClass = item.post_status === 'publish' ? ' gbu-status-publish' : '';

			html += '<tr>';
			html += '<td>' + escHtml( String( index + 1 ) ) + '</td>';
			html += '<td>' + escHtml( item.title ) + '</td>';
			html += '<td><span class="gbu-post-type">' + escHtml( item.post_type ) + '</span></td>';
			html += '<td><span class="gbu-status' + statusClass + '">' + escHtml( item.post_status ) + '</span></td>';
			html += '<td><span class="gbu-badge">' + escHtml( String( item.occurrences ) ) + '</span></td>';
			html += '<td class="gbu-actions">';
			if ( item.edit_url ) {
				html += '<a href="' + escHtml( item.edit_url ) + '">' + escHtml( i18n.edit ) + '</a>';
			}
			if ( item.view_url ) {
				html += '<a href="' + escHtml( item.view_url ) + '" target="_blank" rel="noopener">'
					+ escHtml( i18n.view ) + '</a>';
			}
			html += '</td>';
			html += '</tr>';
		} );

		html += '</tbody></table>';

		resultsEl.innerHTML = html;
	}
}() );
