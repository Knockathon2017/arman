'use strict';

var Promise = require('es6-promise').Promise;
var request = require('request');
var understand = require('../helper/understand');

var token = {
    verify: process.env.VERIFY_TOKEN || "12345678!!",
    page: process.env.PAGE_TOKEN || 'EAAL9Qfs0vwYBAHcZAWJH4AriqAxre73tDX4LlUIlign4l1GpERSvnnte7ZCXIha6WFpVmJwtrz5wAHsUleq01QdRUzqbEdjgEtXS6nsphR11uzL08am3gnrMf111c9IAbZAZBgZAJh5MiU90r7eATbNia0rYVxlQGY0z80BrXt8u4488Tb2ND'
};

module.exports = {

    validate: function(req, res, next) {
        if (req.query['hub.verify_token'] === token.verify) {
            res.send(req.query['hub.challenge'])
        } else {
            res.status(400).send('Error, wrong token');
        }
    },

    message: function(req, res, next) {
        var messaging_events = req.body.entry[0].messaging;

        for (var i = 0; i < messaging_events.length; i++) {
            var event = req.body.entry[0].messaging[i];
            var sender = event.sender.id;

            if (event.message && event.message.text) {
                understand.get(sender, event.message.text, 'text', '', callback.sendMessage);

            } else if (event.postback) {

                /* all reply with user name  */
                callback.getUser(sender).then(function(result) {
                    postback.handleAction(event, sender, JSON.parse(result.body).first_name, callback.sendMessage);
                }).catch(function(err) {
                    console.log(err);
                });
            } else if (event.message && event.message.attachments[0].type == 'location') {
                understand.get(sender, 'map', 'image', '', callback.sendMessage, event.message.attachments[0].payload.coordinates);
            } else if (event.message && event.message.attachments[0].type == 'image') {
                var url = event.message.attachments[0].payload.url;
                understand.get(sender, 'image', 'button', '', callback.sendMessage);
            }
        }

        res.sendStatus(200);
    }

};

var callback = {

    sendMessage: function(messageData) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token.page
            },
            method: 'POST',
            json: messageData
        }, function(error, response, body) {
            if (error) {
                //console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                //console.log('Error: ', response.body.error)
            }
        })
    },

    getUser: function(userId) {
        return new Promise(function(resolve, reject) {
            request({
                url: 'https://graph.facebook.com/v2.6/' + userId + '?access_token=' + token.page,
                method: 'GET'
            }, function(error, response, body) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(response);
                }
            });

        });

    }

};

var postback = {

    handleAction: function(event, sender, name, callback) {
        var action = event.postback.payload;

        switch (action) {
            case 'USER_GREETING':
                understand.get(sender, '', 'greeting', name, callback);
                break;
            case 'REPORT_GARBAGE_LOCATION':
                understand.get(sender, 'report_garbage', 'text', name, callback);
                break;
            case 'COMPLETED_TASK':
                understand.get(sender, 'completed_task', 'text', name, callback);
                break;

        }

    }
};