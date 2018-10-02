import {clearPrices, savePrices} from "./DBClient/updatePrices";
import logToFile from "./logger";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
clearPrices(); //clean data older than a 24h
setInterval(() =>
    axios.get(`https://api.binance.com/api/v1/ticker/24hr`).then(response => {
        savePrices(response.data);
    }).catch(error => {
        logToFile(error);
    }), 1000 * 60 * process.env.ADD_TO_DB_INTERVAL); //add new info every 5min
setInterval(() => clearPrices(), 1000 * 60 * process.env.CLEAN_DB_INTERVAL);//clean data ones a day