const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports.validate = async function(username, password) {
    return new Promise(function(resolve, reject) {
        const Account = mongoose.model('Account');

        Account.findOne({
            'content.username': username
        }, (error, account) => {
            if (error) {
                reject({
                    status: error,
                    code: 500
                });
                return;
            }
            
            if (!account) {
                resolve({
                    exists: false,
                    account: null
                });
                return;
            }

            const hash = account.content.password;

            bcrypt.compare(password, hash, (err, res) => {
                if (err) {                
                    reject({
                        status: err,
                        code: 500
                    });
                    return;
                }

                if (res) {
                    resolve({
                        exists: true,
                        account: account
                    });
                    return;
                }
                
                resolve({
                    exists: true,
                    account: null
                });
            });
        });
    });
}