Template.techListing.onCreated(function() {
	this.challengeId = FlowRouter.getParam("challengeId");
	this.autorun(() => {
		this.challenge = Challenges.findOne({_id: this.challengeId});
	});
	this.subscribe('TechsByChallenge', this.challengeId);
})

Template.techListing.helpers({
	techs: function() {
		return Techs.find({challenge: Template.instance().challengeId});
	}
})

Template.techListing.events({
	'click [data-mfp-src=".addTechModal"]': function(e, template) {
		Session.set("techDoc", {null});
		e.preventDefault();
		if ( Meteor.userId() ) {
			Session.set('insertTech/updateTech', {type: 'insert'});
			Session.set("techModalStatus", 'open');
		} else {
			FlowRouter.go('atLogin');
			Session.set('authSmartMessage', {
				action: 'submitTech',
				message: "Please sign in to submit a technology to "
					+ "<div class='AuthSmartMessage__importantText'>" + template.challenge.title + "</div> challenge.",
			});
		}
	}
})