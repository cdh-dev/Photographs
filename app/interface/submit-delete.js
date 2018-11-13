const mongoose = require('mongoose');

module.exports.submit = async function(postBadge) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.deleteOne({
            'legend.badge': postBadge
        }, (err) => {
            if (err) {
                reject({
                    code: 500,
                    status: err
                });
                return;
            }
            
            resolve(true);
        });
    });
}