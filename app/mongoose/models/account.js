const mongoose = require('mongoose');
const shortid = require('shortid');

const Account = new mongoose.Schema({
    legend: {
        badge: {
            type: String,
            default: shortid.generate
        }
    },
    content: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        stateLock: { // An arbitrary string that is checked against in tokens to ensure password/username hasn't been changed. It must be changed with every password/username change. 
            type: String,
            required: true
        }
    }
}, {
    versionKey: false,
    collection: 'accounts'
});

mongoose.model('Account', Account);