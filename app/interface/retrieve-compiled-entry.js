const mongoose = require('mongoose');

module.exports.retrieve = async function(postBadge, viewer) {
    return new Promise(async function(resolve, reject) {
        try {
            // Submit a view for this entry.
            await require('./submit-entry-view').submit(postBadge, viewer);

            // Get post info
            const entry = await require('./retrieve-entry').retrieve(postBadge);

            const likes = await require('./retrieve-entry-likes').retrieve(postBadge);

            const views = await require('./retrieve-entry-views').retrieve(postBadge);

            const likeable = await require('./retrieve-entry-likeable').retrieve(postBadge, viewer);

            resolve({
                entry: entry,
                meta: {
                    likes: likes,
                    views: views
                },
                user: {
                    likeable: likeable
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}