const mongoose = require('mongoose');

module.exports.init = function() {
    mongoose.connect(process.env.MONGODB_URI);
    loadModels();
}

function loadModels() {
    require('./models/viewer');
    require('./models/account');
    
    require('./models/post');
    
    require('./models/like');
    require('./models/view');
}