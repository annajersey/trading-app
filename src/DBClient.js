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

exports.installDB = async function (symbols) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        console.log('creating symbols table')
        let querySymbols = ` CREATE SEQUENCE IF NOT EXISTS symbols_id_seq start 1 increment 1;
        CREATE TABLE IF NOT EXISTS symbols (
        symbol character varying,
        baseAsset character varying,
        quoteAsset character varying,
        id integer NOT NULL DEFAULT nextval('symbols_id_seq'::regclass),
        CONSTRAINT symbols_pkey PRIMARY KEY (id),
        CONSTRAINT symbols_symbol_key UNIQUE (symbol))`;
        client.query(querySymbols, (err, res) => {
            if (err) console.log(err)
            let query = "";
            symbols.forEach((symbol, key) => {
                query += "(TRIM('" + symbol.symbol + "'),TRIM('" + symbol.baseAsset + "'),TRIM('" + symbol.quoteAsset + "'))"
                if (key !== symbols.length - 1) query += ","
            });

            client.query("INSERT INTO symbols (symbol,baseAsset,quoteAsset) " +
                "VALUES " + query, (err, res) => {
                if (err) console.log(err)
            });
        });

        let queryPrices = `CREATE SEQUENCE IF NOT EXISTS prices_id_seq start 1 increment 1;
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
        CONSTRAINT prices_pkey PRIMARY KEY (id))`;
        console.log('creating prices table')
        client.query(queryPrices, (err, res) => {
            if (err) console.log(err);
        });
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()

    }
}
exports.getSymbols = async function () {
    const client = await pool.connect()
    const result = await client.query({
        rowMode: 'object',
        text: 'SELECT * FROM symbols'
    })
    await client.end()
    return result.rows;
}
exports.savePrices = async function (result) {
    const client = await pool.connect()
    let insetQuery = '';
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
            "VALUES " + insetQuery
        client.query(query, (err, res) => {
            if (err) console.log(err);
        })
    } catch (e) {
        throw e
    } finally {
        console.log('prices saved', new Date());
        client.release()
    }

}

exports.clearPrices = async () => {
    const client = await pool.connect();
    client.query("DELETE from prices WHERE datetime < (now() - '" + process.env.CLEAN_DB_INTERVAL + " minutes'::interval)", (err, res) => {
        if (err) console.log(err);
        client.release()
    }) //delete all records older than a day
    console.log('prices cleaned', new Date());
}
