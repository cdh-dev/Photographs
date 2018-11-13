const mongoose = require('mongoose');

module.exports.submit = async function(postBadge, viewer) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.findOne({
            'legend.badge': postBadge
        }, (error, post) => {
            if (post) {
                const View = mongoose.model('View');

                View.findOne({
                    'legend.post': post._id,
                    'legend.viewer': viewer._id
                }, (error, view) => {
                    if (error) {
                        reject({
                            code: 500,
                            status: error
                        });
                        return;
                    }

                    if (view) {
                        resolve({
                            success: false
                        });
                        return;
                    }

                    View.create({
                        legend: {
                            post: post._id,
                            viewer: viewer._id
                        }
                    }, (err, newView) => {
                        if (err) {
                            reject({
                                code: 500,
                                status: err
                            });
                            return;
                        }

                        resolve({
                            success: true
                        });
                    });
                });

                return;
            }

            if (error) {
                reject({
                    code: 500,
                    status: error
                });
                return;
            }

            reject({
                code: 404,
                status: 'Could not find a post by that badge.'
            });
        });
    });
}