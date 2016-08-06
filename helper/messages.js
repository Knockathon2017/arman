'use strict';

var apputil = require('./util');

var type = {
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

/* defining all reply message */
module.exports = function(messageType) {

    switch (messageType) {
        case type.START_PLAY:
            return 'Awesome :)\nCould you please share your location so that we can lookup nearby challenges.';

        case type.GREETING:
            return 'Welcome, Here you can participate in various cleanup challenges.';

        case type.BUTTON:
            return [{
                type: "postback",
                title: "Task Completed",
                payload: "COMPLETED_TASK"
            }, {
                type: "postback",
                title: "Confirm Report",
                payload: "CONFIRM_REPORT"
            }];

        case type.REPORTED_GARBAGE:
            return 'Hmmm, can you share the snapshot of the place so that we can add it in our challenge list.';

        case type.TASK_COMPLETED:
            return 'Great!! That you have completed the task. We will let you know once verified.';

        case type.STATS:
            return [{
                type: "web_url",
                url: "https://www.oculus.com/en-us/rift/",
                title: "Open Main website"
            }];

        case type.GAME_RULE:
            return "Awesome, now you need to complete the challenge in 2 days to earn 10 points.";

        case type.CONFIRM_REPORT:
            return "👾\nPhew!! you found some garbage. We need to clean it.\nThanks anyways for reporting.";

        default:
            return msgOptions.error[apputil.getRandomNumber(2)];

    }


};

var msgOptions = {

    error: [":(\nOkay, we could not understand this message", ":( As we are in beta, we might fail to understand some messages.\nBut yes we will learn from it"]

};