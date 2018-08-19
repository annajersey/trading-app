import {saveRates} from "./DBClient";

var express = require("express");
var routes = require("./routes.js");
var app = express();
const socketIo = require("socket.io");
routes(app);
const WebSocket = require('ws');

var server = app.listen(5001, function () {
    console.log("app running on port.", server.address().port);
});

const io = socketIo(server);
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
    open: m.o,
    high: m.h,
    low: m.l,
    volume: m.v,
    volumeQuote: m.q,
    openTime: m.O,
    closeTime: m.C,
    firstTradeId: m.F,
    lastTradeId: m.L,
    totalTrades: m.n,
})
io.on("connection", socket => {
    let symbols = socket.handshake.query.symbols.split(',').map(item=>item.toLowerCase()+'@ticker').join('/');
    console.log(symbols);
    let url = 'wss://stream.binance.com:9443/ws/'+symbols;
    const ws = new WebSocket(url);

    ws.on('message', function (data) {
        let result = tickerTransform(JSON.parse(data))
        socket.emit("TradesAPI",  JSON.stringify(result));
        //saveRates(result)
        //console.log(result);
        //server.close();
    });
    socket.on("disconnect", () => console.log("Client disconnected"));
});




//
// axios.get(`https://api.binance.com/api/v1/klines=${req.params.symbol}`) v/api/v1/trades
//https://api.binance.com/api/v1/klines?symbol=LTCBTC&interval=5m
//     .then(response => {
//         console.log(response.data);
//         res.status(200).send(response.data);
//     })
//     .catch(error => {
//         console.log(error);
//     });

