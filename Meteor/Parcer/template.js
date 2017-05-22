import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Feeds, Sources } from '/imports/startup/collections.js';
import { Jobs } from '/imports/api/collections/jobs.js';
import moment from 'moment';

Template.Default.onCreated(function() {
	this.feed = Feeds.find( {}, { limit: 10, sort: { updated_time: -1 } } );
	this.sources = Sources.find();
});


Template.Default.events({
	'click [data-action=request]': function() {
		Meteor.call('schedule');
	}
})

Template.Default.helpers({
	attachments() {
		return this.attachments;
	},
	title() {
		return this.title;
	},
	description() {
		return this.description;
	},
	count() {
		return Template.instance().feed.count();
	},
	source() {
		const sources = Template.instance().sources.fetch();
		const sourceFeedId = this.source._id;
		const feedSource = _.find(sources, ( i ) => {
			return i._id == sourceFeedId;
		});

		if ( feedSource ) {
			return feedSource;
		}
	},
	// TODO. Relative time
	createdAt() {
		return moment(this.created_time).format('DD MMMM YYYY');
	},
	updatedAt() {
		return moment(this.updated_time).format('DD MMMM YYYY');
	},
	feed() {
		return Template.instance().feed;
	},
});
