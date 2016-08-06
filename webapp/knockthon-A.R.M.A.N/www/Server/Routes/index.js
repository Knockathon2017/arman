var express = require(process.env.globalLibsDir+'express');
var router = express.Router();
//var dpctrl = require(process.env.__dir+process.env.globalServerControllers+"HomeController");
var async = require(process.env.globalLibsDir+'async');
var fs = require('fs');

//Render Home page
router.get('/',function(req,res){
    res.sendFile(process.env.__dir + process.env.globalServerView + 'Home.html');
});

//write feedback data
router.post('/submitdata',function(req,res){
    console.log(req.query);
    fs.writeFile(process.env.globalServerFeedback+"\\feedback.txt", req.query.msg, function(err) {
    if(err) {
        return console.log(err);
        //res.json({status:0});
    }
    console.log("The file was saved!");
    res.json({status:200});
}); 
})

//any url other than defined is called redirect to default url
router.get('*',function(req,res){  
    res.redirect(process.env.gocleanWebUrl);
});

 
module.exports = router;