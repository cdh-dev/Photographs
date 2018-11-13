const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const shortid = require('shortid');

module.exports.register = function(app) {
    app.get('/auth/primordial', async (req, res) => {
        const Account = mongoose.model('Account');

        // The primordial soup method only works if there are no other accounts in existance.
        Account.find({}, (err, accounts) => {
            if (err) {
                console.log(err);

                res.json({ result: err });
                return;
            }

            if (accounts.length > 0) {
                res.json({ result: 'There are already accounts in existance!' });
                return;
            }

            const username = 'root';
            const password = shortid.generate();
            const statelock = shortid.generate();

            bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT_ROUNDS), function(err, hash) {
                if (err) {
                    console.log(err);
                    
                    res.json({ result: err });
                    return;
                }
                
                Account.create({
                    content: {
                        username: username,
                        password: hash,
                        stateLock: statelock
                    }
                }, (err, account) => {
                    if (err) {
                        console.log(err);
                        
                        res.json({ result: err });
                        return;
                    }
                    
                    res.json({ result: 'Created account! Check console for temporary password.' });
                    
                    console.log('---------------------');
                    console.log(`Password: ${ password }`);
                    console.log('---------------------');
                });
            });
        });
    });
}