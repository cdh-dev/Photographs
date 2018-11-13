const mongoose = require('mongoose');

module.exports.submit = async function(title, link, size) {
    return new Promise(function(resolve, reject) {
        const Post = mongoose.model('Post');

        Post.create({
            content: {
                title: title,
                upload: {
                    link: link,
                    size: size
                }
            }
        }, (error, post) => {
            if (error) {
                reject({
                    status: error,
                    code: 500
                });
                return;
            }
            
            if (post) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}