import {getSymbols} from "./DBClient/data";
import log from "./logger";

const axios = require("axios");
let appRouter = (app) => {
    app.get("/", (req, res) => {
        res.status(200).send("Welcome to our API");
    });
    app.get("/symbols", (req, res) => {
        getSymbols().then(result => {
            res.status(200).send(result);
        });
    });
    app.get("/price/:symbol", (req, res) => {
        axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${req.params.symbol}`)
            .then(response => {
                res.status(200).send(response.data);
            })
            .catch(error => {
                log.info(error);
            });
    });
    app.get("/hourly/:symbol", (req, res) => {
        let url = `https://api.binance.com/api/v1/klines?symbol=${req.params.symbol}&interval=1m&limit=61`;
        axios.get(url)
            .then(response => {
                let result = response.data.map(item => klinesTransform(item));
                res.status(200).send(JSON.stringify(result));
            })
            .catch(error => {
                log.info(error);
            });
        const klinesTransform = m => ({
            OpenTime: m[0],
            Open: m[1],
            High: m[2],
            Low: m[3],
            Close: m[4],
            Volume: m[5],
            CloseTime: m[6]
        });
    });
};
module.exports = appRouter;