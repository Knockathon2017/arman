'use strict';

module.exports = {

    sendTextMessage: function(recipientId, messageText) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText,
                metadata: "DEVELOPER_DEFINED_METADATA"
            }
        };

        return messageData;

    },

    sendImageMessage: function(recipientId, url) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: url
                    }
                }
            }
        };

        return messageData;
    },

    sendGenericMessage: function() {

    },

    sendVideoMessage: function(recipientId, url) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "video",
                    payload: {
                        url: url
                    }
                }
            }
        };

        return messageData;

    },

    sendTypingMessage: function(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_on"
        };

        return messageData;
    },




};