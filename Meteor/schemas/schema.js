SimpleSchema.debug = true;
Schemas = {};

Schemas.IndustrySector = new SimpleSchema({
	title: {
		type: String,
		label: "Section"
	}
});
IndustrySector.attachSchema(Schemas.IndustrySector);

Schemas.Challenges = new SimpleSchema({
	title: {
		type: String,
		label: "Name of Challenge"
	},
	host: {
		type: String,
		label: 'Who is hosting the challenge?',
		optional: true
	},
	"details": {
		type: String,
		label: 'Challenge Details',
		autoform: {
			rows: 5
		},
		optional: true
	},
	"deadline": {
		type: Date,
		label: 'Deadline',
		optional: true
	},
	"confidential" : {
		type: String,
		label: "Is Confidential?",
		autoform: {
			noselect: true,
			options: [
				{label: 'no', value: "no"},
				{label: 'yes', value: "yes"}
			]
		},
		optional: true
	},
	"isSelectWinner" : {
		type: String,
		label: 'Will you select a winner or only award if the problem is solved?',
		autoform: {
			noselect: true,
			options: [
				{label: 'Select a winner', value: 'Select a winner'},
				{label: 'Only award if the problem solved', value: 'Only award id the problem solved'}
			]
		},
		optional: true
	},
	"isOwn" : {
		type: String,
		label: 'Do you want to own the solution of the "winner"?',
		autoform: {
			noselect: true,
			options: [
				{label: 'no', value: "no"},
				{label: 'yes', value: "yes"}
			]
		},
		optional: true
	},
	"isSponsor" : {
		type: String,
		label: 'Can you sponsor research and select a winning team to solve your problem?',
		optional: true,
		autoform: {
			noselect: true,
			options: [
				{label: 'no', value: "no"},
				{label: 'yes', value: "yes"}
			]
		}
	},
	"solving_or_looking": {
		type: String,
		label: 'Are you solving a problem or looking for open innovations in a given area? ',
		autoform: {
			noselect: true,
			options: [
				{label: 'Solving a problem', value: 'Solving a problem'},
				{label: 'Looking for open innovations', value: 'Looking for open innovations'}
			]
		},
		optional: true
	},
	"prizes": {
		type: [String],
		label: 'Prizes',
		optional: true
	},
	"criteria": {
		type: [String],
		label: 'Criteria',
		optional: true
	},
	"instructions": {
		type: String,
		label: 'Submission Instructions',
		autoform: {
			rows: 5,
		},
		optional: true
	},
	"industry_sector": {
		type: [String],
		label: 'Industry Sector',
		autoform: {
			options: function() {
				Meteor.subscribe('IndustrySector');
				return IndustrySector.find({}).map(function(el){
					return {
						label: el.title,
						value: el._id
					}
				});
			}
		}
	},
	createdAt:{
		type:Date,
		optional:true,
		defaultValue:new Date(),
		autoform: {
			type:"hidden"
		}
	}
});
Challenges.attachSchema(Schemas.Challenges);

Schemas.ChallengesPageBlocks = new SimpleSchema({
	sectionId: {
		type: String,
		autoform: {
			options: function() {
				Meteor.subscribe('IndustrySector');
				return IndustrySector.find({}).map(function(el){
					return {
						label: el.title,
						value: el._id
					}
				});
			}
		}
	},
	image: {
		type: String,
		label: 'Image'
	},
	createdAt:{
		type:Date,
		optional:true,
		defaultValue:new Date(),
		autoform: {
			type:"hidden"
		}
	}
});
ChallengesPageBlocks.attachSchema(Schemas.ChallengesPageBlocks);

Schemas.Techs = new SimpleSchema({
	name: {
		type: String,
		label: "Name of the Technology"
	},
	tagline: {
		type: String,
		label: "Tagline (140 characters)",
		autoform: {
			placeholder: "Describe it in one sentence"
		},
		optional: true
	},
	details: {
		type: String,
		label: "Describe the technology",
		autoform: {
			rows: 5,
			placeholder: "What's the key benefit? What's makes the technology unique"
		}
	},
	media: {
		type: [String],
		regEx: SimpleSchema.RegEx.Url,
		label: "Additional Link(s)",
		autoform: {
			placeholder: "http://"
		},
		optional: true
	},
	patentNumber: {
		type: String,
		label: "Patent Number",
		optional: true
	},
	linkToPatent: {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		label: "Link to Patent",
		autoform: {
			placeholder: "http://"
		},
		optional:true
	},
	linkToPublication: {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		label: "Link to Publication",
		autoform: {
			placeholder: "http://"
		},
		optional:true
	},
	inventor: {
		type: String,
		optional: true,
		autoform: {
			placeholder: "Name of inventor"
		}
	},
	registeredInventors: {
		type: [Object],
		optional: true,
		label: "Registered inventors by invite"
	},
	"registeredInventors.$._id" : {
			type: String
	},
	"registeredInventors.$.name" : {
			type: String
	},
	"registeredInventors.$.createdAt" : {
			type: Date,
			autoValue: function() {
				if (!this.isSet && this.operator !== "$pull") {
					return new Date();
				}
			}
	},
	assignee: {
		type: String,
		optional: true
	},
	votes: {
		type: [Object],
		label: "User votes for the Tech",
		optional: true,
		autoform: {
			type: "hidden"
		}
	},
	"votes.$.userId" : {
			type: String
	},
	"votes.$.createdAt" : {
			type: Date
	},
	createdAt: {
		type: Date,
		autoValue: function() {
			return new Date();
		},
		autoform: {
			omit: true
		}
	},
	challenge: {
		type: String,
		autoform: {
			omit: true,
			defaultValue: function() {
				return FlowRouter.getParam("challengeId");
			}
		},
	},
	userId: {
		type: String,
		autoValue: function() {
			if (this.isInsert) {
				return this.userId;
			} else {
				this.unset();  // Prevent user from supplying their own value
			}
		},
		autoform: {
			omit: true
		}
	}
});
Techs.attachSchema(Schemas.Techs);

InviteFormSchema = new SimpleSchema({
	"email": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "Email address of the person requesting the invite."
	},
	"name": {
		type: String,
		label: "Name of the invited user",
	},
	"challengeId": {
		type: String,
	},
});

InviteInvitorsFormSchema = new SimpleSchema({
	"email": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "The email address of the person requesting the invite."
	},
	"name": {
		type: String,
		label: "The name of the inventor",
	},
	"challengeId": {
		type: String,
	},
	"techId": {
		type: String,
	},
});

InvitesSchema = new SimpleSchema({
	"email": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "Email address of the person requesting the invite."
	},
	"token": {
		type: String,
		label: "The token for this invitation.",
	},
	"name": {
		type: String,
		label: "Name of the invited user",
	},
	type: {
		type: String,
		label: "Invite type"
	},
	"userExists": {
		type: Boolean,
		label: "Is this user already exists?",
		optional: true
	},
	challenge: {
		type: Object,
		label: "Challenge"
	},
	"challenge._id": {
		type: String,
		label: "Challenge Id"
	},
	"challenge.name": {
		type: String,
		label: "Challenge Name"
	},
	tech: {
		type: Object,
		label: "Tech",
		optional: true
	},
	"tech._id": {
		type: String,
		label: "Tech Id",
	},
	"tech.name": {
		type: String,
		label: "Tech Name"
	},
	accepted: {
		type: Boolean,
		label: 'Has it been accepted?',
		defaultValue: false
	},
	invitedBy: {
		type: Object,
		label: "User who send and invite",
		optional: true
	},
	"invitedBy._id": {
		type: String,
		label: "User Id"
	},
	"invitedBy.name": {
		type: String,
		label: "User name"
	},
	createdAt: {
		type: Date,
		denyUpdate: true,
		autoValue: function() {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpsert) {
				return {$setOnInsert: new Date()};
			} else {
          this.unset();  // Prevent user from supplying their own value
        }
      }
  },
  updatedAt: {
  	type: Date,
  	autoValue: function() {
  		if (this.isUpdate) {
  			return new Date();
  		}
  	},
  	denyInsert: true,
  	optional: true
  },
});

Invites.attachSchema( InvitesSchema );


Schemas.ProfileCredentials = new SimpleSchema({
	username: {
		type: String,
		label: "New Username",
		optional: true,
	},
	userPassword: {
		type: String,
		label: "New Password",
		optional: true,
	},
	userEmail: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "Email",
		optional: true,
	}
});

Schemas.ProfileCredentials.messages({
	existEmail: 'Email is exist',
	customError: 'customErrorValue',
	existUsername: 'Username is exist'
});

PostChallengeSurveySchema = new SimpleSchema({
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: "Email Address",
		optional: false
	},
	firstname: {
		type: String,
		label: "First Name",
		optional: false
	},
	lastname: {
		type: String,
		label: "Last Name",
		optional: false
	},
	organization:{
		type: String,
		label: "Organization",
		optional: true
	},
	title:{
		type: String,
		label: "Job Title",
		optional: true
	},
	phone: {
		type: String,
		label: "Phone Number",
		optional: true
	},
	orgtype:{
		type : String,
		optional: true,
		label: "Please describe your organization:",
		autoform: {
			options: [
				{label: 'Entrepreneur Looking for New Venture', value: 'Entrepreneur Looking for New Venture'},
				{label: "Investor", value: "Investor"},
				{label: "Executive at a Startup", value: "Executive at a Startup"},
				{label: "Executive at  a Middle Market Firm", value: "Executive at  a Middle Market Firm" },
				{label: "Executive at a Large Firm", value: "Executive at a Large Firm" },
				{label: "Non-Profit", value: "Non-Profit"},
				{label: "Academic/Research Institution", value: "Academic/Research Institution" }
			]
		}
	},
	contactReason:{
		type : String,
		optional: true,
		label: "Why are you getting in touch?",
		autoform: {
			options: [
				{label: "I have a specific challenge I'd like to post", value: "I have a specific challenge I'd like to post"},
				{label: "I want to run a challenge but I don't have a specific topic yet", value: "I want to run a challenge but I don't have a specific topic yet"},
				{label: "I'd like to fund a challenge for marketing purposes or public good", value: "I'd like to fund a challenge for marketing purposes or public good"},
				{label: "Other", value: "Other"}
			]
		}
	},
	contactReasonOther: {
		type: String,
		label: 'Other',
		max: 1000,
		optional: true,
		custom: function(){
			var customCondition = this.field('contactReason').value === 'Other';
			if (customCondition && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
				return "required";
			}
		}
	},
	problem:{
		type:String,
		label: "What problem are you trying to solve or solution you are looking for? I am looking for:",
		optional: true,
		autoform:{
			options: [
				{label: "a technological solution", value: "a technological solution"},
				{label: "expertise", value: "expertise"},
				{label: "mentor", value: "mentor"},
				{label: "advice", value: "advice"},
				{label: "research consultant", value: "research consultant"},
				{label: "Other", value: "Other"}
			]
		}
	},
	problemOther:{
		type: String,
		optional: true,
		max:1000,
		custom: function(){
			var customCondition = this.field('problem').value === 'Other';
			if (customCondition && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
				return "required";
			}
		}
	},
	deadline: {
		type: Date,
		optional: true,
		label: "Deadline for your post?"
	},
	prize:{
		type:String,
		optional:true,
		label: "Prize:",
		autoform:{
			options: [
				{label: "Cash ($$$ - we have found that money talks)", value: "Cash ($$$ - we have found that money talks)"},
				{label: "Equity or Revenue Sharing", value: "Equity or Revenue Sharing"},
				{label: "My eternal gratitude", value: "My eternal gratitude"},
				{label: "Non-cash prize (describe)", value: "Non-cash prize (describe)"}
			]
		}
	},
	prizeOther:{
		type:String,
		optional:true,
		max:1000,
		custom: function(){
			var customCondition = this.field('prize').value === 'Non-cash prize (describe)';
			if (customCondition && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
				return "required";
			}
		}
	},
	referredBy:{
		type: String,
		optional: true,
		label:"How did you find out about Technium?",
		autoform:{
			options: [
				{label: "I have participated in Technium Challenge", value: "I have participated in Technium Challenge"},
				{label: "Recommended by a colleague or friend", value: "Recommended by a colleague or friend"},
				{label: "Social media (Twitter, FB, LinkedIn, etc.)", value: "Social media (Twitter, FB, LinkedIn, etc.)"},
				{label: "Technium's blog", value: "Technium's blog"},
				{label: "Press/media story", value: "Press/media story"},
				{label: "Other", value: "Other"}
			]
		}
	},
	referredByOther:{
		type:String,
		optional:true,
		max:1000,
		custom: function(){
			var customCondition = this.field('referredBy').value === 'Other';
			if (customCondition && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
				return "required";
			}
		}
	},
	createdAt: {
		type: Date,
		denyUpdate: true,
		autoValue: function () {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpdate) {
				return {$setOnInsert: new Date()};
			} else {
				this.unset();  // Prevent user from supplying their own value
			}
		}
	}
});

ChallengeSurveys.attachSchema(PostChallengeSurveySchema);
