const uuid = require('uuid/v1');
const mongoose = require('mongoose');

const Viewer = new mongoose.Schema({
    legend: {
        badge: {
            type: String,
            default: uuid
        }
    },
    content: {
        address: {
            type: String,
            required: false,
            default: null
        }
    }
}, {
    versionKey: false,
    collection: 'viewers'
});

mongoose.model('Viewer', Viewer);