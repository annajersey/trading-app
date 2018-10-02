import pool from "./config";
import log from "../logger";

exports.savePrices = async (result) => {
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
        const query = "INSERT INTO prices (symbol,priceChange,priceChangePercent," +
            "closePrice,openPrice,highPrice,lowPrice,volume,closeTime,datetime) " +
            "VALUES " + insetQuery;
        client.query(query, (error) => {
            if (error) {log.info(error);}
        });
    } catch (e) {
        throw e;
    } finally {
        log.info("prices saved");
        client.release();
    }
};
exports.clearPrices = async () => {
    const client = await pool.connect();
    client.query("DELETE from prices WHERE datetime < (now() - '" + process.env.CLEAN_DB_INTERVAL + " minutes'::interval)", (error) => {
        if (error) {log.info(error);}
        client.release();
    }); //delete all records older than a day
    log.info("clear old prices data");
};