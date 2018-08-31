import {savePrices} from "./DBClient";
const express = require("express");
const routes = require("./routes.js");
const app = express();
routes(app);
const socketIo = require("socket.io");
const WebSocket = require('ws');
const server = app.listen(5001, function () {
    console.log("app running on port.", server.address().port);
});

const io = socketIo(server);
io.on("connection", socket => {
    let symbols = socket.handshake.query.symbols.split(',').map(item => item.toLowerCase() + '@ticker').join('/');
    console.log(symbols);
    let url = 'wss://stream.binance.com:9443/ws/' + symbols;
    const ws = new WebSocket(url);
    let savedAt = 0;
    ws.on('message', function (data) {
        let result = tickerTransform(JSON.parse(data))
        socket.emit("TradesAPI", JSON.stringify(result));
        var currentTime = Date.now();
        if(currentTime-savedAt>120000){//60000milliseconds
            savePrices(result);
            savedAt = currentTime;
        }


    });
    socket.on("disconnect", () => console.log("Client disconnected"));
});

const tickerTransform = m => ({
    eventType: m.e,
    eventTime: m.E,
    symbol: m.s,
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
