var userapi = require("../Schema/userSchema");

module.exports = {
    Adduser: function(data) {
        return new Promise((resolve, reject) => {
            userapi
                .create(data)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    verifyUser: function(data) {
        return new Promise((resolve, reject) => {
            userapi
                .updateOne({ _id: data }, { $set: { verify: true } })
                .then(result => {
                    resolve(resolve);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    resetPassword: function(data) {
        console.log("data---", data);
        return new Promise((resolve, reject) => {
            userapi
                .updateOne(
                    { email: data["email"] },
                    { $set: { password: data["password"] } }
                )
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log("response>>>", err);
                    reject(err);
                });
        });
    },

    findData: function(filter, fields, option) {
        console.log("Filter", filter, "Field", fields, "option", option);
        return new Promise((resolve, reject) => {
            userapi
                .find(filter, fields)
                .skip(option.skip)
                .limit(option.limit)
                .then(result => {
                    console.log("api>>>", result);
                    resolve(result);
                })
                .catch(err => {
                    console.log("err", err);
                    reject(err);
                });
        });
    },

    Update: function(filter, fields) {
        return new Promise((resolve, reject) => {
            userapi
                .updateOne(filter, { $set: fields })
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};
