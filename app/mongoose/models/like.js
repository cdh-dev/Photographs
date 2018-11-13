const mongoose = require('mongoose');

const Like = new mongoose.Schema({
    legend: {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Viewer',
            required: true
        }
    },
    content: {
    }
}, {
    versionKey: false,
    collection: 'likes'
});

mongoose.model('Like', Like);