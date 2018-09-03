## Trading APP Backend

Cryptocurrency exchange rates application based on Binance API

Application API includes three GET endpoints and one sockets endpoint

Database update and clearing are launched with a periodicity settled in .env

### Installation
* git clone https://github.com/jeremy1l/trading-app.git
* create postgres database
* fill requared parameters in .env
* `npm install`
* `npm run installapp`
* `npm start`

### Test Client
* git clone https://github.com/jeremy1l/tradesapp-client.git
* `npm install`
* in App.js fill endpoint url to match node backend server
* add symbols to track to array this.symbols
* `npm start`

### API Usage
| URL  | Description |
| :------------ |:---------------:|
|/symbols | Symbol information (symbol, quoteasset, baseasset) |
|/price/{symbolId}     | Latest price for a symbol.        |
| /hourly/{symbol} |OHLC data per minute for an hour. For candlestick bars .  |
|?symbols={symbols separeted by coma} | SocketIo endpoint for ticker statistics pushed every second |


#### Technologies
- Node
- Express
- SocketIo
- Axios
- Postgres database

-----------

:tulip: