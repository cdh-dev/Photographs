global.__basedir = __dirname;

require('./app/mongoose/mongoose-loader').init();
require('./app/routing/route-loader').init();