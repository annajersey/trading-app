import {createSymbolsTable} from "./DBClient";
const WebSocket = require('ws');
const axios = require('axios');
const socketIo = require("socket.io");
import socketIOClient from "socket.io-client";
var appRouter = function (app) {
    // app.get("/", function (req, res) {
    //     console.log('test12')
    //     //res.status(200).send("test");
    //     // let state = {
    //     //     response: false,
    //     //     endpoint: "http://127.0.0.1:4003"
    //     // };
    //     // const { endpoint } = state;
    //     // const socket = socketIOClient(endpoint,{path:'/ws/ticker'});
    //     //
    //     // socket.on("FromAPI", data =>  res.send(data));
    //     res.sendFile(__dirname + '/index.html');
    // });
    app.post('/', function(req, res, next) {
        console.log('test')
        var io = req.app.get('socketio');

        io.to("FromAPI").emit("message", data);


    });

    app.get("/install", function (req, res) {
        axios.get('https://api.binance.com/api/v1/exchangeInfo')
            .then(response => {
                createSymbolsTable(response.data.symbols);
                res.status(200).send(response.data.symbols);
            }).catch(error => {
            console.log(error);
        });
    });
    app.get("/symbols", function (req, res) {
        axios.get('https://api.binance.com/api/v1/exchangeInfo')
            .then(response => {
                console.log(response.data);
                res.status(200).send(response.data.symbols);
            })
            .catch(error => {
                console.log(error);
            });

    });

    app.get("/price/:symbol", function (req, res) {
        axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${req.params.symbol}`)
            .then(response => {
                console.log(response.data);
                res.status(200).send(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    });

    app.get("/", function (req, res) {
        console.log(`test`);
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        var io = req.app.get('socketio');
        io.on("connection", socket => {
            console.log(`connected`);
            try {
                const ws = new WebSocket('wss://stream.binance.com:9443/ws/etcusdt@ticker');
                ws.on('message', function (data) {
                    socket.emit("FromAPI", data);
                    console.log(data);
                });

            } catch (error) {
                console.error(`Error: ${error}`);
                socket.on("disconnect", () => console.log("Client disconnected"));
            }
            socket.on("disconnect", () => console.log("Client disconnected"));
        });

    });

}




module.exports = appRouter;