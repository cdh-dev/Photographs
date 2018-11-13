const mongoose = require('mongoose');

module.exports.retrieve = async function(postBadge, viewer) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.findOne({
            'legend.badge': postBadge
        }, (error, post) => {
            if (post) {
                const Like = mongoose.model('Like');

                Like.findOne({
                    'legend.post': post._id,
                    'legend.viewer': viewer._id
                }, (error, like) => {
                    if (error) {
                        reject({
                            status: error,
                            code: 500
                        });
                        return;
                    }

                    resolve(like == null);
                });

                return;
            }

            if (error) {
                reject({
                    status: error,
                    code: 500
                });
                return;
            }

            reject({
                status: 'Could not find a post by that badge.',
                code: 404
            });
        });
    });
}