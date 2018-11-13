const mongoose = require('mongoose');

const View = new mongoose.Schema({
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
    collection: 'views'
});

mongoose.model('View', View);