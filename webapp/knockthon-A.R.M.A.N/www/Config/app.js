//required packages are called
var express = require(process.env.globalLibsDir+'express')
,   app = express()
,   bodyParser = require(process.env.globalLibsDir+'body-parser')
,   http = require('http')
,   index_routes = require(process.env.__dir+process.env.globalServerRoutes+"index");

//required to interpret all the values in body of request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//required files called

app.use("/assets/css",express.static(process.env.__dir+"/Support/css"));
app.use("/assets/preloader",express.static(process.env.__dir+"/Support/preloader"));
app.use("/assets/js",express.static(process.env.__dir+"/Support/js"));
app.use("/assets/img",express.static(process.env.__dir+"/Support/img"));
app.use("/assets/app",express.static(process.env.__dir+"/Client"));
app.use("/assets/controllers",express.static(process.env.__dir+"/Client/Controllers"));
app.use("/assets/services",express.static(process.env.__dir+"/Client/Services"));
app.use("/assets/shared",express.static(process.env.__dir+"/Client/Shared"));
app.use("/assets/client",express.static(process.env.__dir+"/Client/Views"));
app.use("/assets/font",express.static(process.env.__dir+"/Support/font"));


//routing
app.use('/', index_routes);

//port number is assigned on which web server will work
app.listen(process.env.PORT || 3000);