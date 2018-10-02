import express from "express";
import routes from "./routes.js";
import socketIo from "socket.io";
import WebSocket from "ws";
import logToFile from "./logger";
import prices from "./prices";

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
routes(app);

const server = app.listen(5001, () => {
    console.log("Trading App running on port.", server.address().port);
});
const io = socketIo(server);
io.on("connection", socket => {
    const symbols = socket.handshake.query.symbols.split(",").map(item => item.toLowerCase() + "@ticker").join("/");
    const url = "wss://stream.binance.com:9443/ws/" + symbols;
    const ws = new WebSocket(url);
    ws.on("message", (data) => {
        const result = tickerTransform(JSON.parse(data));
        socket.emit("TradesAPI", JSON.stringify(result));
    });
    socket.on("disconnect", () => logToFile("Client disconnected"));
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
    });
});

