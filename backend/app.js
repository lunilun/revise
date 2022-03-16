const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const noCache = require('nocache');
var app = express();

app.use(express.urlencoded({limit:'50mb' ,extended: true, parameterLimit:50000}));
app.use(express.json({limit:'50mb'}));
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.expectCt()); 
app.use(cors());
app.use(noCache());
var port = process.env.PORT || 3000; 

var router = require('./routes/route');
app.use('/',router);

app.listen(port, function(){ 
    console.log(`App Listening on port `+port); 
});