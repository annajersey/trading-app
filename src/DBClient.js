import dotenv from 'dotenv';
const axios = require('axios');

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
    CREATE SEQUENCE IF NOT EXISTS prices_id_seq start 1 increment 1;
    CREATE TABLE IF NOT EXISTS prices (
        symbol character(80),
      
        priceChange numeric,
        priceChangePercent numeric,
        lastPrice numeric,
         openPrice numeric,
          highPrice numeric,
           lowPrice numeric,
           volume numeric,
           closeTime numeric
             datetime timestamp without time zone,
        id integer NOT NULL DEFAULT nextval('rates_id_seq'::regclass),
        CONSTRAINT rates_pkey PRIMARY KEY (id))
        
        `;
    pool.query(query, (err, res) => {
        console.log(err, res);
    });
}




    exports.savePrices =  (result) => {



                let query =
                    "UPDATE prices SET field='C', field2='Z' WHERE id=3;"

                    "INSERT INTO prices (symbol,priceChange,priceChangePercent," +
                    "lastPrice,openPrice,highPrice,lowPrice,volume,closeTime,datetime) " +
                    "VALUES ('" + result.symbol + "','" + result.priceChange + "','" + result.priceChangePercent + "','" +
                    +result.lastPrice + "','"
                    + result.openPrice + "','"
                    + result.highPrice + "','"
                    + result.lowPrice + "','"
                    + result.volume + "','"
                    + result.closeTime + "', current_timestamp) " +
                    "WHERE NOT EXISTS (SELECT 1 FROM table WHERE symbol='" + result.symbol + "');";

                console.log(query);
                pool.query(query, (err, res) => {
                    console.log(err);
                })


                    .catch(error => {
                        console.log(error);
                    });

    }
