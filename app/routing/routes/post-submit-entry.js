const jwt = require('jsonwebtoken');
const response = require(`${__basedir}/app/routing/utils/response`);

module.exports.register = function(app) {
    app.post('/admin/do/upload', async (req, res) => {
        const title = req.body.payload.title;
        const link = req.body.payload.link;
        const size = {
            x: req.body.payload.size.x,
            y: req.body.payload.size.y
        }

        if (typeof(title) === 'undefined' || typeof(link) === 'undefined' || typeof(size.x) === 'undefined' || typeof(size.y) === 'undefined') {
            res.json(response.success(false));
            return;
        }

        try {
            const account = await require(`${__basedir}/app/routing/utils/get-auth-from-request`).get(req);

            // Couldn't find the account
            if (!account) {
                res.json(response.success(false));
                return;
            }

            const validation = await require(`${__basedir}/app/interface/submit-entry`).submit(title, link, size);
            
            res.json(response.success(validation));
        } catch (error) {
            console.log(error);

            res.json({ error: error });
            res.status(error.code);
        }
    });
}