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

exports.createSymbolsTable = function (symbols) {
    let query = `
    CREATE SEQUENCE IF NOT EXISTS symbols_id_seq start 1 increment 1;
    CREATE TABLE IF NOT EXISTS symbols (
        symbol character(80),
        baseAsset character(80),
        quoteAsset character(80),
        id integer NOT NULL DEFAULT nextval('symbols_id_seq'::regclass),
        CONSTRAINT currencies_pkey PRIMARY KEY (id))
        CONSTRAINT symbols_symbol_key UNIQUE (symbol)
        `;

    pool.query(query, (err, res) => {
        console.log(err, res);
        let query = "";
        symbols.forEach((symbol, key) => {
            console.log('symbol', symbol.baseAsset, symbol.quoteAsset)
            query += "('" + symbol.symbol + "','" + symbol.baseAsset + "','" + symbol.quoteAsset + "')"
            if (key !== symbols.length - 1) query += ","
        });
        console.log(query);
        pool.query("INSERT INTO symbols (symbol,baseAsset,quoteAsset) " +
            "VALUES " + query, (err, res) => {
            console.log(err, res);
            pool.end()
        });
    });

    let query2 = `
    CREATE SEQUENCE IF NOT EXISTS rates_id_seq start 1 increment 1;
    CREATE TABLE IF NOT EXISTS rates (
        symbol character(80),
        datetime timestamp without time zone,
        priceChange numeric,
        priceChangePercent numeric,
        lastPrice numeric,
         open numeric,
          high numeric,
           low numeric,
        id integer NOT NULL DEFAULT nextval('rates_id_seq'::regclass),
        CONSTRAINT rates_pkey PRIMARY KEY (id))
        
        `;
    pool.query(query, (err, res) => {
        console.log(err, res);
    });
}

exports.clearDb = function () {
    pool.query("DELETE from currencies where datetime < CURRENT_TIMESTAMP - INTERVAL '30 days'"
        , (err, res) => {
            console.log(err, res);

        })
}
exports.saveRates = function (result) {
    let query="INSERT INTO rates (symbol,priceChange,priceChangePercent,lastPrice,open,high,low,datetime) " +
        "VALUES ('" + result.symbol + "','" + result.priceChange + "','"+result.priceChangePercent+"','" +
        + result.curDayClose + "','"
        + result.open + "','"
        + result.high + "','"
        + result.low + "', current_timestamp)";
    console.log(query);
    pool.query(query, (err, res) => {
        //console.log(err);

    })
    //pool.end();


}
exports.saveToDb = function (name, price) {
    console.log(name, price);
    if (isNaN(price)) return;
    pool.query("SELECT count(*) from currencies where name='" + name + "'", (err, res) => {

        //todo escape query
        //console.log(res.rows[0].count)
        pool.query("INSERT INTO currencies (name,price,datetime) " +
            "VALUES ('" + name + "','" + price + "',current_timestamp)", (err, res) => {
            //console.log(err, res);

        })
        //pool.end();


    });


}

