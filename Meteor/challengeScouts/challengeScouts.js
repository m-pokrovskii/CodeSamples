Template.challengeScouts.onCreated(function() {
	this.subscribe('Scouts', FlowRouter.getParam('challengeId'));
});


Template.challengeScouts.helpers({
	scouts: function() {
		return Meteor.users.find( { "joinedChallenges._id": FlowRouter.getParam('challengeId') } );
	},
	scoutUserName: function() {
		return Helpers.getUserName(this._id);
	}
})

Template.challengeScouts.events({
	'click [data-js="sendInvite"]': function(e) {
		e.preventDefault();
		Session.set("InviteFormPopup", "open");
	}
})
