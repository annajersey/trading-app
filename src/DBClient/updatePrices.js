import pool from "./config";
exports.savePrices = async function (result) {
    const client = await pool.connect();
    let insetQuery = "";
    result.forEach(item =>
        insetQuery += " ('" + item.symbol + "','"
            + item.priceChange + "','"
            + item.priceChangePercent + "','" +
            +item.lastPrice + "','"
            + item.openPrice + "','"
            + item.highPrice + "','"
            + item.lowPrice + "','"
            + item.volume + "','"
            + item.closeTime + "', current_timestamp),");
    insetQuery = insetQuery.slice(0, -1);
    try {
        let query = "INSERT INTO prices (symbol,priceChange,priceChangePercent," +
            "closePrice,openPrice,highPrice,lowPrice,volume,closeTime,datetime) " +
            "VALUES " + insetQuery;
        client.query(query, (err, res) => {
            if (err) console.log(err);
        });
    } catch (e) {
        throw e;
    } finally {
        console.log("prices saved", new Date());
        client.release();
    }
};
exports.clearPrices = async () => {
    const client = await pool.connect();
    client.query("DELETE from prices WHERE datetime < (now() - '" + process.env.CLEAN_DB_INTERVAL + " minutes'::interval)", (err, res) => {
        if (err) console.log(err);
        client.release();
    }); //delete all records older than a day
    console.log("clear old prices data", new Date());
};