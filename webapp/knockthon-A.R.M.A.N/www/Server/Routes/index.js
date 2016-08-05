var express = require(process.env.globalLibsDir+'express');
var router = express.Router();
//var dpctrl = require(process.env.__dir+process.env.globalServerControllers+"HomeController");
var async = require(process.env.globalLibsDir+'async');

//Render Home page
router.get('/',function(req,res){
    res.sendFile(process.env.__dir + process.env.globalServerView + 'Home.html');
});

//any url other than defined is called redirect to default url
router.get('*',function(req,res){  
    res.redirect(process.env.gocleanWebUrl);
});

 
module.exports = router;