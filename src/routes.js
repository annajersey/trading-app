import {createSymbolsTable} from "./DBClient";
const WebSocket = require('ws');
const axios = require('axios');
const socketIo = require("socket.io");
var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.status(200).send("Welcome to our API");
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

    app.get("/ws/ticker", function (req, res) {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/etcusdt@ticker');
        ws.on('message', function (data) {
            //res.status(200).send(data);
            console.log(data);
        });
    });
    }




module.exports = appRouter;