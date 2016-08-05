'use strict';

var home = require('./home');

module.exports = function(app) {

    /* for validating facebook webhook */
    app.get('/fb_webhook', home.validate);

    /* for getting facebook messasge */
    app.post('/fb_webhook', home.message);

};