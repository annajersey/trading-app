import dotenv from 'dotenv';
dotenv.config();

const pg = require('pg');
const pool = new pg.Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});

exports.installDB = async function () {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        console.log('creating symbols table')
        let query = ` CREATE SEQUENCE IF NOT EXISTS symbols_id_seq start 1 increment 1;
        CREATE TABLE IF NOT EXISTS symbols (
        symbol character(80),
        baseAsset character(80),
        quoteAsset character(80),
        id integer NOT NULL DEFAULT nextval('symbols_id_seq'::regclass),
        CONSTRAINT symbols_pkey PRIMARY KEY (id),
        CONSTRAINT symbols_symbol_key UNIQUE (symbol))`;
        client.query(query, (err, res) => {
            if(err) console.log(err)
            let query = "";
            symbols.forEach((symbol, key) => {
                query += "('" + symbol.symbol + "','" + symbol.baseAsset + "','" + symbol.quoteAsset + "')"
                if (key !== symbols.length - 1) query += ","
            });

            client.query("INSERT INTO symbols (symbol,baseAsset,quoteAsset) " +
                "VALUES " + query, (err, res) => {
                if(err) console.log(err)
            });
        });

        let query2 = `CREATE SEQUENCE IF NOT EXISTS prices_id_seq start 1 increment 1;
        CREATE TABLE IF NOT EXISTS prices (
        symbol character(80),
        priceChange numeric,
        priceChangePercent numeric,
        openPrice numeric,
        highPrice numeric,
        lowPrice numeric,
        closePrice numeric,
        volume numeric,
        closeTime numeric,
        datetime timestamp without time zone,
        id integer NOT NULL DEFAULT nextval('prices_id_seq'::regclass),
        CONSTRAINT prices_pkey PRIMARY KEY (id),
        CONSTRAINT prices_symbol_key UNIQUE (symbol))`;
        console.log('creating prices table')
        client.query(query2, (err, res) => {
            if(err) console.log(err);
        });
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()

    }
}

exports.savePrices = async function (result) {
    const client = await pool.connect()
    try {
        await
        client.query('BEGIN');
        let query= "INSERT INTO prices (symbol,priceChange,priceChangePercent," +
            "closePrice,openPrice,highPrice,lowPrice,volume,closeTime,datetime) " +
            "VALUES ('" + result.symbol + "','" + result.priceChange + "','" + result.priceChangePercent + "','" +
            +result.curDayClose + "','"
            + result.openPrice + "','"
            + result.highPrice + "','"
            + result.lowPrice + "','"
            + result.volume + "','"
            + result.closeTime + "', current_timestamp) " +
            "  ON CONFLICT (symbol) " +
            "  DO UPDATE SET " +
            "symbol='" + result.symbol + "'," +
            " priceChange='" + result.priceChange + "'," +
            " priceChangePercent='" + result.priceChangePercent + "'," +
            " openPrice='" + result.openPrice + "'," +
            " highPrice='" + result.highPrice + "'," +
            " lowPrice='" + result.lowPrice + "'," +
            " closePrice='" + result.curDayClose + "'," +
            " volume='" + result.volume + "'," +
            " closeTime='" + result.closeTime + "'," +
            " datetime=current_timestamp " +
            " WHERE prices.symbol='" + result.symbol + "';"

        client.query(query, (err, res) => {
            if(err) console.log(err);
        })

        await
        client.query('COMMIT')
    } catch (e) {
        await
        client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }

}
