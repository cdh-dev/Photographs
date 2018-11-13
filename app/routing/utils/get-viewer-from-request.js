const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports.findFromReq = async function(req) {
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const token = req.body.vtoken;

    return new Promise(function(resolve, reject) {
        const Viewer = mongoose.model('Viewer');

        // We'll first try and identify them through their token. We can trust the unique token above all.
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (decoded && decoded.target !== 'viewer') {
                decoded = null; // If this token isn't for viewers (i.e. it's for authentication)
            }

            if (error || !decoded) { // Invalid token, so we'll go with the address.                
                Viewer.findOne({
                    'content.address': address
                }, (error, viewer) => {
                    // If we found a viewer
                    if (viewer) {
                        resolve(viewer);
                        return;
                    }

                    if (error) {
                        reject(error);
                        return;
                    }

                    createViewer(address, resolve, reject);
                });
                return;
            }

            const tokenBadge = decoded.badge;
            Viewer.findOne({
                'legend.badge': tokenBadge
            }, (error, viewer) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (viewer) {
                    // Update viewer's address if it's changed.
                    if (viewer.content.address != address) {
                        viewer.content.address = address;

                        viewer.save((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(viewer);
                            }
                        });
                        return;
                    }

                    resolve(viewer);
                    return;
                }

                // No viewer found, so we gotta make a new one.
                createViewer(address, resolve, reject);
            });
        });
    });
}

function createViewer(address, resolve, reject) {
    const Viewer = mongoose.model('Viewer');

    Viewer.create({
        content: {
            address: address
        }
    }, (err, viewer) => {
        if (err) {
            reject(err);
            return;
        }

        resolve(viewer);
    });
}