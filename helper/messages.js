'use strict';

var type = {
    START_PLAY: 'start_play',
    GREETING: 'greeting',
    IMAGE: 'image',
    BUTTON: 'button',
    REPORTED_GARBAGE: 'report_garbage',
    TASK_COMPLETED: 'task_completed',
    CHALLENGE_LIST: 'challenge_list',
    STATS: 'stats',
    GAME_RULE: 'game_rule'
};

/* defining all reply message */
module.exports = function(messageType) {

    switch (messageType) {
        case type.START_PLAY:
            return 'Awesome\nCould you please share your location so that we can lookup near by challenges.';

        case type.GREETING:
            return 'Welcome, Here you can participate in various cleanup challenges.';

        case type.BUTTON:
            return [{
                type: "postback",
                title: "Report Garbage",
                payload: "REPORT_GARBAGE_LOCATION"
            }, {
                type: "postback",
                title: "Task Completed",
                payload: "COMPLETED_TASK"
            }];

        case type.REPORTED_GARBAGE:
            return 'Hmm, you can share the location of the place so that we can add it into our challenge list.';

        case type.TASK_COMPLETED:
            return 'Great!! That you have completed the task. We will verify and notify you.';

        case type.STATS:
            return [{
                type: "web_url",
                url: "https://www.oculus.com/en-us/rift/",
                title: "Open Web URL"
            }];

        case type.GAME_RULE:
            return "Awesome, now you need to complete the challenge in 2 days to earn 10 points."

        default:
            return "Okay, we could not understand this message";

    }


};