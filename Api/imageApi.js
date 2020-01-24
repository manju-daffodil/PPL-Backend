var imageApi = require("../Schema/imageSchema");

module.exports = {
    imageUpload: function(data) {
        return new Promise((resolve, reject) => {
            imageApi.create(data, function(err, result) {
                if (result) {
                    resolve(result);
                }
                if (err) {
                    reject(err);
                }
            });
        });
    },

    Comment: function(data) {
        return new Promise((resolve, reject) => {
            imageApi.updateOne(
                { _id: data.id },
                { $push: { comment: data.comment } },
                function(err, result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(err);
                    }
                }
            );
        });
    },

    imageLikes: function(data) {
        return new Promise((resolve, reject) => {
            imageApi
                .updateOne(
                    { _id: data.imageId },
                    { $push: { likes: data.userId } }
                )
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    },

    findData: function(filter, fields, option) {
        return new Promise((resolve, reject) => {
            imageApi
                .find(filter, fields)
                .sort(option.sort)
                .skip(option.skip)
                .limit(option.limit)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    countPost: function(filter) {
        return new Promise((resolve, result) => {
            imageApi
                .find(filter)
                .count()
                .then(result => {
                    console.log("ResultCount>>>", result);
                    resolve(result);
                })
                .catch(err => {
                    console.log("Err---", err);
                    reject(err);
                });
        });
    }
};
