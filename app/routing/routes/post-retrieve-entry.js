const mongoose = require('mongoose');
const response = require(`${__basedir}/app/routing/utils/response`);

module.exports.register = function(app) {
    app.post('/posts/:post', async (req, res) => {
        const postBadge = req.param('post');

        try {
            // We're going to get the current viewer.
            const viewer = await require(`${__basedir}/app/routing/utils/get-viewer-from-request`).findFromReq(req);

            const compiled = await require(`${ __basedir }/app/interface/retrieve-compiled-entry`).retrieve(postBadge, viewer);

            const token = require(`${ __basedir }/app/routing/utils/create-token`).createVToken(viewer.legend.badge);

            res.json(response.withContentAndVToken(compiled, token));
        } catch (error) {
            console.log(error);
            
            res.status(error.code);
            res.json({ error: error.status });
        }
    });
}