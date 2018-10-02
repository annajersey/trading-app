import {installDB} from "./DBClient/install";
import logToFile from "./logger";
import axios from "axios";

axios.get("https://api.binance.com/api/v1/exchangeInfo")
    .then(response => {
        installDB(response.data.symbols);
    }).catch(error => {
    logToFile(error);
});