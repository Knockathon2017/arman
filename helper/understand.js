'use strict';

var helper = require('./delivery');
var reply = require('./messages');
var apputil = require('./util');

var natural = require('natural');
var classifier = new natural.BayesClassifier();
var _ = require('underscore');
var imageToTextDecoder = require('image-to-text');
//var wordnet = new natural.WordNet();

var messageType = {
    START_PLAY: 'start_play',
    GREETING: 'greeting',
    IMAGE: 'image',
    BUTTON: 'button',
    REPORTED_GARBAGE: 'report_garbage',
    TASK_COMPLETED: 'task_completed',
    CHALLENGE_LIST: 'challenge_list',
    STATS: 'stats',
    GAME_RULE: 'game_rule',
    CONFIRM_REPORT: 'confirm_report'
};

var SERVER_PATH = process.env.SERVER_IMAGE_PATH || 'https://f976634d.ngrok.io/images/';

module.exports = {

    get: function(recipientId, recievedMessage, type, name, callback, optional) {
        var msgAbout = parser.whatTheMessageIsAllAbout(recievedMessage, optional);

        /* ugly conditions */
        if (msgAbout == messageType.CHALLENGE_LIST) type = 'image_list';
        if (msgAbout == messageType.STATS) type = "web_link";

        switch (type) {

            case 'text':
                var replyMessage = reply(msgAbout);
                callback(helper.sendTextMessage(recipientId, replyMessage));
                console.log(replyMessage);
                if (replyMessage.indexOf('Okay, we could not understand this message') > -1) {
                    callback(helper.sendQuickReply(recipientId));
                }
                break;

            case 'image':
                callback(helper.sendImageMessage(recipientId, msgAbout));
                callback(helper.sendTypingMessage(recipientId));
                callback(helper.sendTextMessage(recipientId, reply(messageType.GAME_RULE)));
                break;

            case 'greeting':
                var replyMessage = reply(messageType.GREETING); /* default behaviour */
                callback(helper.sendTextMessage(recipientId, 'Hi ' + name + ',\n' + replyMessage));
                break;

            case 'button':
                var replyMessage = reply(msgAbout); /* default behaviour */
                callback(helper.sendTypingMessage(recipientId));
                callback(helper.sendButtonMessage(recipientId, 'Choose from the following', replyMessage));
                break;

            case 'image_list':
                callback(helper.sendMultipleImages(recipientId, [SERVER_PATH + apputil.getRandomNumber(6) + '.jpg', SERVER_PATH + apputil.getRandomNumber(6) + '.jpg', SERVER_PATH + apputil.getRandomNumber(6) + '.jpg']));
                break;

            case 'web_link':
                var replyMessage = reply(msgAbout); /* default behaviour */
                callback(helper.sendWebLink(recipientId, replyMessage));
                break;

        }

    }

};

var parser = {

    /* we predict message either by type or by message content */
    whatTheMessageIsAllAbout: function(text, optional) {
        text = text.toLowerCase();

        if (text.indexOf('play') > -1 || text.indexOf('start') > -1) {
            return messageType.START_PLAY;
        } else if (text == 'map') {
            //return SERVER_PATH + apputil.getRandomNumber(6) + '.jpg';
            var lat = optional.lat - optional.lat / 10000;
            var long = optional.long - optional.long / 10000;
            return 'https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=640x400&maptype=roadmap&markers=color:red|label:C|' + lat + ',' + long;
        } else if (text == 'image') {
            return messageType.BUTTON;
        } else if (text == 'report_garbage') {
            return messageType.REPORTED_GARBAGE;
        } else if (text == 'completed_task') {
            return messageType.TASK_COMPLETED;
        } else if (text.indexOf('more challenges') > -1 || text.indexOf('nearby challenges') > -1) {
            return messageType.CHALLENGE_LIST;
        } else if (text.indexOf('stats') > -1) {
            return messageType.STATS;
        } else if (text.indexOf('confirm_report') == 0) {
            return messageType.CONFIRM_REPORT;
        }

        return null;

    }

};