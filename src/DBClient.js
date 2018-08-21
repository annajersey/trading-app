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


exports.save12HourStats = function () {
    let symbols=['ETHBTC','LTCBTC','BNBBTC','NEOBTC','QTUMETH','EOSETH','SNTETH','BNTETH','BCCBTC','GASBTC','BNBETH','BTCUSDT','ETHUSDT','HSRBTC','OAXETH','DNTETH','MCOETH','ICNETH','MCOBTC','WTCBTC','WTCETH','LRCBTC','LRCETH','QTUMBTC','YOYOBTC','OMGBTC','OMGETH','ZRXBTC','ZRXETH','STRATBTC','STRATETH','SNGLSBTC','SNGLSETH','BQXBTC','BQXETH','KNCBTC','KNCETH','FUNBTC','FUNETH','SNMBTC','SNMETH','NEOETH','IOTABTC','IOTAETH','LINKBTC','LINKETH','XVGBTC','XVGETH','SALTBTC','SALTETH','MDABTC','MDAETH','MTLBTC','MTLETH','SUBBTC','SUBETH','EOSBTC','SNTBTC','ETCETH','ETCBTC','MTHBTC','MTHETH','ENGBTC','ENGETH','DNTBTC','ZECBTC','ZECETH','BNTBTC','ASTBTC','ASTETH','DASHBTC','DASHETH','OAXBTC','ICNBTC','BTGBTC','BTGETH','EVXBTC','EVXETH','REQBTC','REQETH','VIBBTC','VIBETH','HSRETH','TRXBTC','TRXETH','POWRBTC','POWRETH','ARKBTC','ARKETH','YOYOETH','XRPBTC','XRPETH','MODBTC','MODETH','ENJBTC','ENJETH','STORJBTC','STORJETH','BNBUSDT','VENBNB','YOYOBNB','POWRBNB','VENBTC','VENETH','KMDBTC','KMDETH','NULSBNB','RCNBTC','RCNETH','RCNBNB','NULSBTC','NULSETH','RDNBTC','RDNETH','RDNBNB','XMRBTC','XMRETH','DLTBNB','WTCBNB','DLTBTC','DLTETH','AMBBTC','AMBETH','AMBBNB','BCCETH','BCCUSDT','BCCBNB','BATBTC','BATETH','BATBNB','BCPTBTC','BCPTETH','BCPTBNB','ARNBTC','ARNETH','GVTBTC','GVTETH','CDTBTC','CDTETH','GXSBTC','GXSETH','NEOUSDT','NEOBNB','POEBTC','POEETH','QSPBTC','QSPETH','QSPBNB','BTSBTC','BTSETH','BTSBNB','XZCBTC','XZCETH','XZCBNB','LSKBTC','LSKETH','LSKBNB','TNTBTC','TNTETH','FUELBTC','FUELETH','MANABTC','MANAETH','BCDBTC','BCDETH','DGDBTC','DGDETH','IOTABNB','ADXBTC','ADXETH','ADXBNB','ADABTC','ADAETH','PPTBTC','PPTETH','CMTBTC','CMTETH','CMTBNB','XLMBTC','XLMETH','XLMBNB','CNDBTC','CNDETH','CNDBNB','LENDBTC','LENDETH','WABIBTC','WABIETH','WABIBNB','LTCETH','LTCUSDT','LTCBNB','TNBBTC','TNBETH','WAVESBTC','WAVESETH','WAVESBNB','GTOBTC','GTOETH','GTOBNB','ICXBTC','ICXETH','ICXBNB','OSTBTC','OSTETH','OSTBNB','ELFBTC','ELFETH','AIONBTC','AIONETH','AIONBNB','NEBLBTC','NEBLETH','NEBLBNB','BRDBTC','BRDETH','BRDBNB','MCOBNB','EDOBTC','EDOETH','WINGSBTC','WINGSETH','NAVBTC','NAVETH','NAVBNB','LUNBTC','LUNETH','TRIGBTC','TRIGETH','TRIGBNB','APPCBTC','APPCETH','APPCBNB','VIBEBTC','VIBEETH','RLCBTC','RLCETH','RLCBNB','INSBTC','INSETH','PIVXBTC','PIVXETH','PIVXBNB','IOSTBTC','IOSTETH','CHATBTC','CHATETH','STEEMBTC','STEEMETH','STEEMBNB','NANOBTC','NANOETH','NANOBNB','VIABTC','VIAETH','VIABNB','BLZBTC','BLZETH','BLZBNB','AEBTC','AEETH','AEBNB','RPXBTC','RPXETH','RPXBNB','NCASHBTC','NCASHETH','NCASHBNB','POABTC','POAETH','POABNB','ZILBTC','ZILETH','ZILBNB','ONTBTC','ONTETH','ONTBNB','STORMBTC','STORMETH','STORMBNB','QTUMBNB','QTUMUSDT','XEMBTC','XEMETH','XEMBNB','WANBTC','WANETH','WANBNB','WPRBTC','WPRETH','QLCBTC','QLCETH','SYSBTC','SYSETH','SYSBNB','QLCBNB','GRSBTC','GRSETH','ADAUSDT','ADABNB','CLOAKBTC','CLOAKETH','GNTBTC','GNTETH','GNTBNB','LOOMBTC','LOOMETH','LOOMBNB','XRPUSDT','BCNBTC','BCNETH','BCNBNB','REPBTC','REPETH','REPBNB','TUSDBTC','TUSDETH','TUSDBNB','ZENBTC','ZENETH','ZENBNB','SKYBTC','SKYETH','SKYBNB','EOSUSDT','EOSBNB','CVCBTC','CVCETH','CVCBNB','THETABTC','THETAETH','THETABNB','XRPBNB','TUSDUSDT','IOTAUSDT','XLMUSDT','IOTXBTC','IOTXETH','QKCBTC','QKCETH','AGIBTC','AGIETH','AGIBNB','NXSBTC','NXSETH','NXSBNB','ENJBNB','DATABTC','DATAETH','ONTUSDT','TRXUSDT','ETCUSDT','ETCBNB','ICXUSDT','SCBTC','SCETH','SCBNB','NPXSBTC','NPXSETH','VENUSDT','KEYBTC','KEYETH','NASBTC','NASETH','NASBNB','MFTBTC','MFTETH','MFTBNB','DENTBTC','DENTETH','ARDRBTC','ARDRETH','ARDRBNB','NULSUSDT','HOTBTC','HOTETH','VETBTC','VETETH','VETUSDT','VETBNB','DOCKBTC','DOCKETH','POLYBTC','POLYBNB','PHXBTC','PHXETH','PHXBNB','HCBTC','HCETH']
    symbols.forEach((symbol, index, array) => {
        let url = `https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=1m&limit=61`;
        axios.get(url)
            .then(response => {
                let data = response.data.map(item => klinesTransform(item));
                data.forEach(result =>
                {
                    let query = "INSERT INTO trades (symbol,volume,close,open,high,low,datetime) " +
                        "VALUES ('" + symbol + "','"
                        + result.Volume + "','"
                        + result.Close + "','"
                        + result.Open + "','"
                        + result.High + "','"
                        + result.Low + "', " +
                        "current_timestamp)";
                    console.log(query);
                    pool.query(query, (err, res) => {
                        console.log(err);
                    })
                })

            })
            .catch(error => {
                console.log(error);
            });
    })

    const klinesTransform = m => ({
        OpenTime: m[0],
        Open: m[1],
        High: m[2],
        Low: m[3],
        Close: m[4],
        Volume: m[5],
        CloseTime: m[6]
    });
}