const jwt = require('jsonwebtoken');
const response = require(`${__basedir}/app/routing/utils/response`);

module.exports.register = function(app) {
    app.post('/auth/validate', async (req, res) => {
        try {
            const account = await require(`${__basedir}/app/routing/utils/get-auth-from-request`).get(req);

            // Couldn't find the account
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