const mongoose = require('mongoose');
const shortid = require('shortid');

const Post = new mongoose.Schema({
    legend: {
        badge: {
            type: String,
            default: shortid.generate
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    content: {
        title: {
            type: String,
            required: true
        },
        upload: {
            link: {
                type: String,
                required: true
            },
            size: {
                x: {
                    type: Number,
                    required: true
                },
                y: {
                    type: Number,
                    required: true
                }
            }
        }
    }
}, {
    versionKey: false,
    collection: 'posts'
});

mongoose.model('Post', Post);