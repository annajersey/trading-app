var express = require("express");
var routes = require("./routes.js");
var app = express();
routes(app);
const socketIo = require("socket.io");
const WebSocket = require('ws');
var server = app.listen(5001, function () {
    console.log("app running on port.", server.address().port);
});

const io = socketIo(server);

io.on("connection", socket => {
    let symbols = socket.handshake.query.symbols.split(',').map(item=>item.toLowerCase()+'@ticker').join('/');
    console.log(symbols);
    let url = 'wss://stream.binance.com:9443/ws/'+symbols;
    const ws = new WebSocket(url);
    ws.on('message', function (data) {
        let result = tickerTransform(JSON.parse(data))
        socket.emit("TradesAPI",  JSON.stringify(result));
        savePrices(result);
        console.log(result);

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
