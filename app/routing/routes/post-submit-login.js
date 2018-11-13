const jwt = require('jsonwebtoken');
const response = require(`${__basedir}/app/routing/utils/response`);

module.exports.register = function(app) {
    app.post('/auth/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        try {
            const validation = await require(`${__basedir}/app/interface/retrieve-account`).validate(username, password);

            const exists = validation.exists;
            const account = validation.account;

            // Username doesn't exist.
            if (!exists) {
                res.json(response.withAToken(false, null, null));
                return;
            }
            
            // Password is invalid
            if (!account) {
                res.json(response.withAToken(false, null, null));
                return;
            }
            
            const token = require(`${ __basedir }/app/routing/utils/create-token`).createAToken(account.legend.badge, account.content.stateLock);
            res.json(response.withAToken(true, account.content.username, token));
        } catch (error) {
            console.log(error);

            res.json({ error: error });
            res.status(error.code);
        }
    });
}