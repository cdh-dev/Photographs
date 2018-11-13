const mongoose = require('mongoose');
const response = require(`${__basedir}/app/routing/utils/response`);

module.exports.register = function(app) {
    app.post('/posts/:post/do/like', async (req, res) => {
        const Post = mongoose.model('Post');
        const postBadge = req.param('post');

        try {
            // We're going to get the current viewer.
            const viewer = await require(`${__basedir}/app/routing/utils/get-viewer-from-request`).findFromReq(req);

            if (!viewer) {
                return;
            }

            const success = await require(`${__basedir}/app/interface/submit-entry-like`).submit(postBadge, viewer);

            if (!success) {
                return;
            }

            const token = require(`${ __basedir }/app/routing/utils/create-token`).createVToken(viewer.legend.badge);

            res.json(response.withContentAndVToken({
                content: success
            }, token));
        } catch (error) {
            console.log(error);

            res.status(error.code);
            res.json({ error: error.status });
        }
    });
}