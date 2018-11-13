const mongoose = require('mongoose');

module.exports.retrieve = async function(postBadge) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.findOne({
            'legend.badge': postBadge
        }, (error, post) => {
            if (post) {
                const Like = mongoose.model('Like');

                Like.find({
                    'legend.post': post._id
                }, (error, likes) => {
                    if (error) {
                        reject({
                            status: error,
                            code: 500
                        });
                        return;
                    }

                    const count = likes.length;
                    resolve(count);
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