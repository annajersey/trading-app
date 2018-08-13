var express = require("express");
var routes = require("./routes.js");
var app = express();
const socketIo = require("socket.io");
routes(app);

// var server = app.listen(4001, function () {
//     console.log("app running on port.", server.address().port);
// });

const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
    console.log("New client connected"), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
    try {
        const res = await axios.get(
            "https://api.darksky.net/forecast/c1523870dd534c1909d704dbcd2e2aff/43.7695,11.2558"
        );
        socket.emit("FromAPI", res.data.currently.temperature);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

server.listen(4001, () => console.log(`Listening on port 4001`));