const express = require('express');

const bodyParser = require('body-parser');
const expressSslify = require('express-sslify');
const cors = require('cors');

const path = require('path');

module.exports.init = function() {
    const app = express();

    app.use(cors());
    app.use(expressSslify.HTTPS({ trustProtoHeader: true }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(express.static(path.join(__basedir, 'client/build')));

    loadRoutes(app);

    app.get('*', (req, res) => {
        res.sendFile(path.join(__basedir + '/client/build/index.html'));
    });

    var port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log("Express is listening on " + port);
    });
}

function loadRoutes(app) {
    require('./routes/post-retrieve-entries').register(app);
    require('./routes/post-retrieve-entry').register(app);
    require('./routes/post-submit-entry-like').register(app);

    require('./routes/post-submit-login').register(app);
    require('./routes/post-validate-login').register(app);

    require('./routes/post-submit-entry').register(app);
    require('./routes/post-submit-delete').register(app);

    require('./routes/get-primordial-login').register(app);
}