'use strict';

var home = require('./home');

var user = require('../controller/User')

module.exports = function(app) {

    /* for validating facebook webhook */
    app.get('/fb_webhook', home.validate);

    /* for getting facebook messasge */
    app.post('/fb_webhook', home.message);

     app.get('/user/detail', user.list);

     app.post('/user/create', user.create);


     app.get('/user/update/:username', user.read)
     app.put('/user/update/:username', user.update);

};