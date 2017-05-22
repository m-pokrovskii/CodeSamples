// TODO: Promise
Challenge = (function(){
	function join(challengeId) {
		Meteor.call('joinChallenge', challengeId, function(e, respond) {
			if ( respond && respond.status === 'add' ) {
				sAlert.success("You've <strong>joined</strong> the challenge <br>" + "<em>" + respond.challenge.name + "</em>");
			}
		});
	}
	function leave(challengeId) {
		Meteor.call('leaveChallenge', challengeId, function(e, respond) {
			if ( respond && respond.status === 'remove' ) {
				sAlert.success("You've <strong>left</strong> the challenge <br>" + "<em>" + respond.challenge.name + "</em>");
			}
		})
	}
	function toggle(challengeId) {
		Meteor.call('toggleChallenge', challengeId, function(e, respond) {
			if ( respond && respond.status === 'add' ) {
				sAlert.success("You've <strong>joined</strong> the challenge <br>" + "<em>" + respond.challenge.name + "</em>");
			} else if ( respond && respond.status === 'remove' ) {
				sAlert.success("You've <strong>left</strong> the challenge <br>" + "<em>" + respond.challenge.name + "</em>");
			}
		})
	}
	return {
		join: join,
		leave: leave,
		toggle: toggle
	}
}());