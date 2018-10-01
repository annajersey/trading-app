import {installDB} from "./DBClient/install";
const axios = require("axios");
axios.get("https://api.binance.com/api/v1/exchangeInfo")
    .then(response => {
        installDB(response.data.symbols);
    }).catch(error => {
    console.log(error);
});