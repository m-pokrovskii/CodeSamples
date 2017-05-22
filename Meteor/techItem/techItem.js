Template.techItem.onCreated(function() {
	this.challengeId = FlowRouter.getParam("challengeId");
	this.techId = this.data._id;
	this.subscribe('files.tech.byTechId', this.techId);	
	this.autorun(() => {
		this.challenge = Challenges.findOne({_id: this.challengeId});
	});
});

Template.techItem.helpers({
	thumbnail() {
		const tech = Files.tech.findOne( { "meta.techId": this._id, "meta.techThumbnail": true }, {sort: {"meta.created_at": -1} } );
		return tech && tech.link();
	},
	techUrl() {
		return FlowRouter.path('challengeTechSingle', {challengeId: Template.instance().challengeId, techId: this._id});
	},
	tag() {
		return Helpers.getTechTag(this);
	},
	canDeleteTech() {
		if ( this.userId === Meteor.userId() ) {
			return true;
		}
	},
	canUpdateTech() {
		if (this.userId === Meteor.userId() || lodash.some( this.registeredInventors, { _id: Meteor.userId() } ) ) {
			return true
		}
	},
	votes() {
		return this.votes && this.votes.length || 0;
	},
	isVoted() {
		return !!Techs.findOne( { _id: this._id, "votes.userId": Meteor.userId() } );
	}
});

Template.techItem.events({
	'click .techItem__editTechLink': function(e, template) {
		e.preventDefault();
		Session.set('popupTemplate', "addTechModal");
		Session.set('insertTech/updateTech', {
			type: 'update',
			id: template.data._id
		});
		Session.set("techModalStatus", 'open');
	},
	'click .techItem__deleteTechLink': function(e,i) {
		e.preventDefault();
		Meteor.call("tech.delete", {techId: i.data._id}, (e) => {
			if (e) {
				sAlert.error(e.error);
				return false;
			}
			sAlert.success("Tech has been deleted");
		});
	},
	'click .vote__up': function(e, template) {
		e.preventDefault();
		const techId = template.techId;

		if ( Meteor.userId() ) {
			Challenge.join( FlowRouter.getParam("challengeId") );
			
			Meteor.call('toggleVoteTech', techId, function(e, result) {
				if (e) { throw new Meteor.Error(e) }
			});
			
		} else {
			FlowRouter.go('atLogin');
			Session.set('authSmartMessage', {
				action: 'upvoteTech',
				message: "Please sign in to upvote "
					+ "<div class='AuthSmartMessage__importantText'>" + template.challenge.title + "</div> challenge.",
			});			
		}
	}
})