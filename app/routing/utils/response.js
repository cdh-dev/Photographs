module.exports.withContentAndVToken = function(content, vtoken) {
    return {
        index: {
            payload: content,
            vtoken: vtoken
        }
    }
}

module.exports.withAToken = function(success, username, atoken) {
    return {
        index: {
            payload: {
                success: success,
                username: username
            },
            atoken: atoken
        }
    }
}

module.exports.success = function(success) {
    return {
        index: {
            payload: {
                success: success
            }
        }
    }
}