import {installDB} from "./DBClient/install";
import log from "./logger";

const axios = require("axios");
axios.get("https://api.binance.com/api/v1/exchangeInfo")
    .then(response => {
        installDB(response.data.symbols);
    }).catch(error => {
    log.info(error);
});