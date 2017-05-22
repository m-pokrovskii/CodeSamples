ChallengesPageBlocks.helpers({
	sectionTitle: function() {
			let industrySector = IndustrySector.findOne({_id: this.sectionId});
			if (industrySector) {
				return industrySector.title;
			}
	}
});

IndustrySector.helpers({
	challenges: function() {
		let challenges = Challenges.find({industry_sector: this._id}).map((el) => {
			return el.title;
		});
		return challenges;
	}
});

Meteor.users.helpers({
  isJoinedToChallenge( {userId, challengeId} ) {
  	const user = this;
  	if ( user && lodash.some( user.joinedChallenges,  { _id: challengeId } ) ) {
  		return true;
  	} else {
  		return false;
  	}
  }
});
