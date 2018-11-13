const mongoose = require('mongoose');
const response = require(`${__basedir}/app/routing/utils/response`);

module.exports.register = function(app) {
    app.post('/admin/do/delete', async (req, res) => {
        const Post = mongoose.model('Post');
        const postBadge = req.body.badge;

        try {
            const account = await require(`${__basedir}/app/routing/utils/get-auth-from-request`).get(req);

            // Couldn't find the account
            if (!account) {
                res.json(response.success(false));
                return;
            }
            
            const success = await require(`${__basedir}/app/interface/submit-delete`).submit(postBadge);

            if (!success) {
                return;
            }

            res.json(response.success(success));
        } catch (error) {
            console.log(error);

            res.status(error.code);
            res.json({ error: error.status });
        }
    });
}