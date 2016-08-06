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

    sendButtonMessage: function(recipientId, heading, payload) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: heading,
                        buttons: payload
                    }
                }
            }
        };

        return messageData;
    },

    sendMultipleImages: function(recipientId, imageArray) {
        var imgObjArray = [];

        imageArray.forEach(function(obj) {
            imgObjArray.push({
                title: "Challenge",
                subtitle: "Some Challenge",
                item_url: "https://www.oculus.com/en-us/rift/",
                image_url: obj
            });
        });

        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: imgObjArray
                    }
                }
            }
        };

        return messageData;
    },

    sendWebLink: function(recipientId, payload) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "View Complete Statistics",
                        buttons: payload
                    }
                }
            }
        };

        return messageData;
    },

    sendGIF: function(recipientId, url) {
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
    }

};