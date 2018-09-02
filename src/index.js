import {clearPrices, savePrices} from "./DBClient";
import dotenv from 'dotenv';
dotenv.config();
const axios = require('axios');
const express = require("express");
const routes = require("./routes.js");
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
routes(app);
const socketIo = require("socket.io");
const WebSocket = require('ws');
const server = app.listen(5001, function () {
    console.log("app running on port.", server.address().port);
});

const io = socketIo(server);
io.on("connection", socket => {
    let symbols = socket.handshake.query.symbols.split(',').map(item => item.toLowerCase() + '@ticker').join('/');
    let url = 'wss://stream.binance.com:9443/ws/' + symbols;
    const ws = new WebSocket(url);
    ws.on('message', function (data) {
        let result = tickerTransform(JSON.parse(data))
        socket.emit("TradesAPI", JSON.stringify(result));
    });
    socket.on("disconnect", () => console.log("Client disconnected"));
    const tickerTransform = m => ({
        symbol: m.s,
        eventTime: m.E,
        priceChange: m.p,
        priceChangePercent: m.P,
        weightedAvg: m.w,
        prevDayClose: m.x,
        curDayClose: m.c,
        closeTradeQuantity: m.Q,
        bestBid: m.b,
        bestBidQnt: m.B,
        bestAsk: m.a,
        bestAskQnt: m.A,
        openPrice: m.o,
        highPrice: m.h,
        lowPrice: m.l,
        volume: m.v,
        volumeQuote: m.q,
        openTime: m.O,
        closeTime: m.C,
        firstTradeId: m.F,
        lastTradeId: m.L,
        totalTrades: m.n,
    })
});


setInterval(()=>
    axios.get(`https://api.binance.com/api/v1/ticker/24hr`).then(response => {
        savePrices(response.data);
    }).catch(error => {console.log(error);}), 1000*60*process.env.ADD_TO_DB_INTERVAL) //add new info every 5min

setInterval(()=>
    axios.get(`https://api.binance.com/api/v1/ticker/24hr`).then(response => {
        clearPrices(response.data);
    }).catch(error => {console.log(error);}), 1000*60*process.env.CLEAN_DB_INTERVAL)//clean data ones a day