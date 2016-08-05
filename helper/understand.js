'use strict';

var helper = require('./delivery');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
//var wordnet = new natural.WordNet();

module.exports = {

    get: function(recipientId, recievedMessage, callback) {
        callback(helper.sendTextMessage(recipientId, recievedMessage));
    }

};

var parser = {

    whatTheMessageIsAllAbout: function() {

    }

};