Template.challengeDetails.onCreated(function() {
	const challengeId = FlowRouter.getParam("challengeId");
	this.joinButtonText = {
		join: "Join Challenge",
		joined: "Joined",
		leave: "Leave Challenge"
	};
	this.challengeId = challengeId;
	this.subscribe( "ChallengesById", challengeId );
	this.autorun(() => {
		this.challenge = Challenges.findOne({_id: challengeId});
	})
});

Template.challengeDetails.helpers({
	challenge: function() {
		return Challenges.findOne({_id: Template.instance().challengeId});
	},
	singlePrice: function() {
		return this.prizes[0];
	},
	joinButton: () => {
		let button;
		const challengeId = Template.instance().challengeId;
		const joinedChalenges = Meteor.user() && Meteor.user().joinedChallenges;
		if (joinedChalenges && lodash.some( joinedChalenges,  { _id: challengeId } )) {
			button = '<button class="btn btn--secondary -joined" data-js="joinTheChallenge">' + Template.instance().joinButtonText.joined + '</button>';	
		} else {
			button = '<button class="btn btn--secondary" data-js="joinTheChallenge">' + Template.instance().joinButtonText.join + '</button>';	
		}
		return button;
	}
});

Template.challengeDetails.events({
	'mouseenter .-joined': (e, template) => {
		e.currentTarget.textContent = Template.instance().joinButtonText.leave;
	},
	'mouseleave .-joined': (e, template) => {
		e.currentTarget.textContent = Template.instance().joinButtonText.joined;
	},
	'click [data-js="openAllDetails"]': function(e, template) {
		let $allDetails = template.$('.challengeDetails__allDetails');
		let $icon = $(e.currentTarget).find('i.fa');
		if ($allDetails.is(":hidden")) {
			$icon.removeClass('fa-caret-down');
			$icon.addClass('fa-caret-up');
			$allDetails.velocity("slideDown");	
		} else {
			$allDetails.velocity("slideUp");
			$icon.removeClass('fa-caret-up');
			$icon.addClass('fa-caret-down');
		}
	},
	'click [data-js="joinTheChallenge"]': function(e, template) {
		const challengeId = FlowRouter.getParam("challengeId");

		if (!challengeId) {
			throw new Meteor.Error('default', 'No challenge ID');
		}

		if ( !Meteor.userId() ) {
			Session.set('joinChallengeId', challengeId);
			Session.set('authSmartMessage', {
				action: 'challengeJoin',
				message: "Please sign in to join "
				+ "<div class='AuthSmartMessage__importantText'>" + template.challenge.title + "</div> challenge.",
			});
			FlowRouter.go('atLogin');
		} else {
			Challenge.toggle(challengeId);	
		}
	}
})