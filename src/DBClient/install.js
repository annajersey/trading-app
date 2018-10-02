import pool from "./config";

exports.installDB = async (symbols) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        console.log("Creating symbols table");
        const querySymbols = `CREATE SEQUENCE IF NOT EXISTS symbols_id_seq start 1 increment 1;
        CREATE TABLE IF NOT EXISTS symbols (
        symbol character varying,
        baseAsset character varying,
        quoteAsset character varying,
        id integer NOT NULL DEFAULT nextval('symbols_id_seq'::regclass),
        CONSTRAINT symbols_pkey PRIMARY KEY (id),
        CONSTRAINT symbols_symbol_key UNIQUE (symbol))`;
        client.query(querySymbols, (err) => {
            if (err) {
                console.log(err);
            }
            let query = "";
            symbols.forEach((symbol, key) => {
                query += "(TRIM('" + symbol.symbol + "'),TRIM('" + symbol.baseAsset + "'),TRIM('" + symbol.quoteAsset + "'))";
                if (key !== symbols.length - 1) {
                    query += ",";
                }
            });
            client.query("INSERT INTO symbols (symbol,baseAsset,quoteAsset) " +
                "VALUES " + query, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
        const queryPrices = `CREATE SEQUENCE IF NOT EXISTS prices_id_seq start 1 increment 1;
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
        console.log("creating prices table");
        client.query(queryPrices, (err) => {
            if (err) {
                console.log(err);
            }
        });
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};