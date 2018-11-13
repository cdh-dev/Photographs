const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports.get = async function(req) {
    return new Promise(function(resolve, reject) {
        const token = req.body.atoken;

        const Account = mongoose.model('Account');

        // We'll first try and identify them through their token. We can trust the unique token above all.
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (decoded && decoded.target !== 'authentication') {
                decoded = null; // If this token isn't for viewers (i.e. it's for authentication)
            }

            if (error || !decoded) { // Invalid token, so there's no nobody logged in.
                reject({
                    status: error,
                    code: 500
                });
                return;
            }

            const tokenBadge = decoded.badge;
            const stateLock = decoded.stateLock;

            Account.findOne({
                'legend.badge': tokenBadge,
                'content.stateLock': stateLock
            }, (error, account) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(account);
            });
        });
    });
}