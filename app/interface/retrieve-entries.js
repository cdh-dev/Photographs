const mongoose = require('mongoose');

module.exports.retrieve = async function(viewer) {
    return new Promise(async function(resolve, reject) {
        try {
            const Post = mongoose.model('Post');

            Post.find({}).sort({
                'legend.date': -1
            }).exec(async (error, posts) => {
                if (error) {
                    reject(error);
                    return;
                }

                const sortedPosts = await Promise.all(posts.map(async (post) => {
                    const entry = await require('./retrieve-compiled-entry').retrieve(post.legend.badge, viewer);
                    return entry;
                }));

                resolve(sortedPosts);
            });
        } catch (error) {
            reject(error);
        }
    });
}