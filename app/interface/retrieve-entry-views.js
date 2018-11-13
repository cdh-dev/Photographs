const mongoose = require('mongoose');

module.exports.retrieve = async function(postBadge) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.findOne({
            'legend.badge': postBadge
        }, (error, post) => {
            if (post) {
                const View = mongoose.model('View');

                View.find({
                    'legend.post': post._id
                }, (error, views) => {
                    if (error) {
                        reject({
                            status: error,
                            code: 500
                        });
                        return;
                    }

                    const count = views.length;
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