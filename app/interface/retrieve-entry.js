const mongoose = require('mongoose');

module.exports.retrieve = async function(postBadge) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.findOne({
            'legend.badge': postBadge
        }).select({ _id: 0 }).exec((error, post) => {
            if (error) {
                reject({
                    status: error,
                    code: 500
                });
                return;
            }

            if (post) {
                resolve(post);
                return;
            }

            reject({
                status: 'Could not find a post by that badge.',
                code: 404
            });
        });
    });
}