## Trading APP Backend

Cryptocurrency exchange rates application based on Binance API

Application API includes three GET endpoints and one sockets endpoint

Database update and clearing are launched with a periodicity settled in .env

### Installation
* git clone https://github.com/jeremy1l/trading-app.git
* Create postgres database
* Fill requared parameters in .env
  * Database credentials
  * Intervals to save/clear prices db table (in minutes)
* `npm install`
* `npm run installapp`
* `npm start`

### Test Client
* git clone https://github.com/jeremy1l/tradesapp-client.git
* `npm install`
* in App.js fill endpoint url to match node backend server
* add symbols to track to array this.symbols
* `npm start`

## API Usage
**Get all system symbols:**
```
GET /symbols
```

Response:
```javascript
[{
    "symbol": "BTCUSDT",
    "baseasset": "BTC",
    "quoteasset": "USDT",
},...]
```
**Latest price for a symbol.**
```
GET /price/{symbol}  
```
_Example:_ /price/BTCUSDT 
Response:
```javascript
{
    "symbol": "BTCUSDT",
    "price":"7255.01000000"
}
```
**OHLC data per minute for last hour. For candlestick bars.**
```
GET /hourly/{symbol}
```
_Example:_ /hourly/ETHBTC 

Response:
```javascript
[{
    "OpenTime":1535958720000,
    "Open":"7238.44000000",
    "High":"7238.44000000",
    "Low":"7233.10000000",
    "Close":"7238.00000000",
    "Volume":"4.40431300",
    "CloseTime":1535958779999
},...]
```

**SocketIo Stream for ticker statistics pushed every second**
```
?symbols={symbols_separeted_by_coma}
```
_Example:_ ?symbols=ETHBTC,BTCUSDT,ETHUSDT

`Event name: TradesAPI`

Response:
```javascript
{
    "symbol":"ETHBTC",
    "eventTime":1535964640495,
    "priceChange":"-0.00106100",
    "priceChangePercent":"-2.588",
    "weightedAvg":"0.04031640",
    "prevDayClose":"0.04098900",
    "curDayClose":"0.03992800",
    "closeTradeQuantity":"0.41900000",
    "bestBid":"0.03990900",
    "bestBidQnt":"1.49300000",
    "bestAsk":"0.03992800",
    "bestAskQnt":"8.64000000",
    "openPrice":"0.04098900",
    "highPrice":"0.04105000",
    "lowPrice":"0.03983000",
    "volume":"153274.27600000",
    "volumeQuote":"6179.46705478",
    "openTime":1535878240492,
    "closeTime":1535964640492,
    "firstTradeId":80072674,
    "lastTradeId":80194571,
    "totalTrades":121898
}
```




#### Technologies Used
- Node
- Express
- SocketIo
- PostgreSQL 

-----------
