const jwt = require('jsonwebtoken');

module.exports.createVToken = function(badge) {
    const newToken = jwt.sign({
        badge: badge,
        target: 'viewer'
    }, process.env.JWT_SECRET);

    return newToken;
}

module.exports.createAToken = function(badge, stateLock) {
    const newToken = jwt.sign({
        badge: badge,
        stateLock: stateLock,
        target: 'authentication'
    }, process.env.JWT_SECRET);
    
    return newToken;
}