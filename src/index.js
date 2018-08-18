var express = require("express");
var routes = require("./routes.js");
var app = express();
const socketIo = require("socket.io");

const io = socketIo(server);

var cors = require('cors');
app.use(cors());
app.set('socketio', io);
routes(app);


var server = app.listen(4003, function () {
    console.log("app running on port.", server.address().port);
});




