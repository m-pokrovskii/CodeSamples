var knox, bound, client, Request, cfdomain;

Files = {}

if (Meteor.isClient) {
	Uploads = {};
	Uploads.Tech = new Mongo.Collection(null);
	Uploads.TechThumbnail = new Mongo.Collection(null);
}

if (Meteor.isServer) {
	// Fix CloudFront certificate issue
	// Read: https://github.com/chilts/awssum/issues/164
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

	knox = Npm.require('knox');
	Request = Npm.require('request');
	bound = Meteor.bindEnvironment(function(callback) {
		return callback();
	});
	cfdomain = 'https://d9uudtl30soat.cloudfront.net'; // <-- Change to your Cloud Front Domain
	client = knox.createClient({
		key: Meteor.settings.private.S3.AccessKeyID,
		secret: Meteor.settings.private.S3.SecretAccessKey,
		bucket: Meteor.settings.private.S3.Bucket,
		region: Meteor.settings.private.S3.Region
	});
}

Files.tech = new FilesCollection({
	debug: false, // Change to `true` for debugging
	throttle: false,
	storagePath: 'public/uploads/Files.tech',
	collectionName: 'Files.tech',
	allowClientCode: true,
	onAfterUpload: function(fileRef) {
		// In onAfterUpload callback we will move file to AWS:S3
		var self = this;
		_.each(fileRef.versions, function(vRef, version) {
			// We use Random.id() instead of real file's _id
			// to secure files from reverse engineering
			// As after viewing this code it will be easy
			// to get access to unlisted and protected files
			var filePath = "techUploads/" + (Random.id()) + "-" + version + "." + fileRef.extension;
			client.putFile(vRef.path, filePath, function(error, res) {
				bound(function() {
					var upd;
					if (error) {
						console.error(error);
					} else {
						upd = {
							$set: {}
						};
						upd['$set']["versions." + version + ".meta.pipeFrom"] = cfdomain + '/' + filePath;
						upd['$set']["versions." + version + ".meta.pipePath"] = filePath;
						self.collection.update({
							_id: fileRef._id
						}, upd, function(error) {
							if (error) {
								console.error(error);
							} else {
								// Unlink original files from FS
								// after successful upload to AWS:S3
								self.unlink(self.collection.findOne(fileRef._id), version);
							}
						});
					}
				});
			});
		});
	},
	interceptDownload: function(http, fileRef, version) {
		var path, ref, ref1, ref2;
		path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
		if (path) {
			// If file is moved to S3
			// We will pipe request to S3
			// So, original link will stay always secure
			Request({
				url: path,
				headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
			}).pipe(http.response);
			return true;
		} else {
			// While file is not yet uploaded to S3
			// We will serve file from FS
			return false;
		}
	},
	onBeforeUpload: function(file) {
		// Allow upload files under 20MB, and only in png/jpg/jpeg formats
		if (file.size <= 20485760 && /png|jpg|jpeg/i.test(file.extension)) {
			return true;
		} else {
			return 'Please upload image, with size equal or less than 10MB';
		}
	},
	onBeforeRemove: function(cursor) {
		return Meteor.userId() === this.userId;
	}
});

if (Meteor.isServer) {
	// Intercept File's collection remove method
	// to remove file from S3
	var _origRemove = Files.tech.remove;

	Files.tech.remove = function(search) {
		var cursor = this.collection.find(search);
		cursor.forEach(function(fileRef) {
			_.each(fileRef.versions, function(vRef) {
				var ref;
				if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
					client.deleteFile(vRef.meta.pipePath, function(error) {
						bound(function() {
							if (error) {
								console.error(error);
							}
						});
					});
				}
			});
		});
		// Call original method
		_origRemove.call(this, search);
	};

	if (Meteor.isServer) {
		Meteor.publish('files.tech.all', () => {
			return Files.tech.collection.find();
		})

		Meteor.publish('files.tech.byTechId', (techId) => {
			return Files.tech.collection.find({ "meta.techId": techId });
		})
	}
}
