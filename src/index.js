import {savePrices} from "./DBClient";
const express = require("express");
const routes = require("./routes.js");
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
routes(app);
const socketIo = require("socket.io");
const WebSocket = require('ws');
const server = app.listen(5001, function () {
    console.log("app running on port.", server.address().port);
});

const io = socketIo(server);
let savedAt = 0;

io.on("connection", socket => {
    let symbols = socket.handshake.query.symbols.split(',').map(item => item.toLowerCase() + '@ticker').join('/');
    console.log(symbols);
    let url = 'wss://stream.binance.com:9443/ws/' + symbols;
    const ws = new WebSocket(url);
    ws.on('message', function (data) {
        let result = tickerTransform(JSON.parse(data))
        socket.emit("TradesAPI", JSON.stringify(result));
        var currentTime = Date.now();
        if(currentTime-savedAt>180000){//2min
            savePrices(result);
            savedAt = currentTime;
            console.log('savedAt',new Date(savedAt));
        }


    });
    socket.on("disconnect", () => console.log("Client disconnected"));
});

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
