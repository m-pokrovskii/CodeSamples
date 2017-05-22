import _ from 'lodash';

export const NormalizeFB = (function() {
	'use strict';
	function start ( feed, source ) {
		let normalized = {
			id: feed.id,
			title: normalizeTitle( feed.message ),
			description: normalizeDescription( feed.message ),
			attachments: normalizeAttachments( feed.attachments ),
			source: {
				_id: source._id,
			},
			permalink_url: feed.permalink_url,
			created_time: normalizeTime( feed.created_time ),
			updated_time: normalizeTime( feed.updated_time ),
			raw: feed
		};
		return normalized;
	};

	function normalizeAttachments( attachments ) {
		if( !attachments ) return false;
		return _.get(attachments, 'data[0].subattachments.data', attachments.data);
	}

	function normalizeTitle ( message ) {
		if( !message ) return false;
		if( message.split('\n').length == 1 ) return false;

		return message.split('\n', 1)[0];
	}

	function normalizeDescription ( message ) {
		if ( !message ) return false;
		if( message.split('\n').length == 1 ) {
			return message;
		} else {
			let description = message.split('\n');
			description.shift();
			description = description.join('<br>');
			return description;
		}
	}

	function normalizeTime ( time ) {
		return Date.parse(time);
	}

	return {
		start: start
	}
}());
