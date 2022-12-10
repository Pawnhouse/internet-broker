const util = require('util');
const finnhub = require('finnhub');


class Prices {
  constructor() {
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_API_KEY;
    this.finnhubClient = new finnhub.DefaultApi();
    this.stockList = [];
  }

  quote(code) {
    code = code.toUpperCase();
    return util.promisify(this.finnhubClient.quote).call(this.finnhubClient, code);
  }

  stockCandles(code) {
    code = code.toUpperCase();
    const start = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const end = Math.floor(Date.now() / 1000);
    return util.promisify(this.finnhubClient.stockCandles).call(this.finnhubClient, code, 'D', start, end);
  }

  async updateStockPrice(stock) {
    if (Date.now() - stock.lastUpdate > 60000) {
      try {
        const { c } = await this.quote(stock.code);
        stock.price = c;
      } catch (e) {
        console.log(e);
      }
      stock.lastUpdate = Date.now();
    }
  }

  async getStockPrice(code) {
    let stock = this.stockList.find(stock => stock.code === code);
    if (!stock) {
      stock = { code, price: undefined, lastUpdate: new Date(0), candleLastUpdate: new Date(0) };
      this.stockList.push(stock);
    }
    await this.updateStockPrice(stock);
    return stock.price;
  }

  async getStockCandles(code) {
    let stock = this.stockList.find(stock => stock.code === code);
    let currentPrice;
    if (!stock) {
      stock = { code, candles: undefined, lastUpdate: new Date(0), candleLastUpdate: new Date(0) };
      this.stockList.push(stock);
    }

    if (Date.now() - stock.candleLastUpdate > 24 * 60 * 60 * 1000) {
      try {
        const data = await this.stockCandles(stock.code);
        stock.candles = data;
        stock.candleLastUpdate = Date.now();
      } catch (e) {
        console.log(e);
        stock.candleLastUpdate = Date.now() - 24 * 60 * 60 * 1000 + 60 * 1000;
      }
    }
    await this.updateStockPrice(stock);

    return stock;
  }

  async getSharesCandles(shares) {
    const stockListWithCandles = [];
    await Promise.all(shares.stockList.map(async (stock) => {
      stockListWithCandles.push(await this.getStockCandles(stock.code));
    }));
    shares.stockList = stockListWithCandles;

    const candlesList = shares.stockList.map(stock => stock.candles);
    const length = candlesList.reduce((acc, value) => Math.min(acc, value.o.length), candlesList[0].o.length); 
    
    //const initialArray = Array.from({ length }, (v, i) => 0);
    const candles = { o: Array.from({ length }, () => 0)};
    candlesList.forEach(element => {
      for (let i = 0; i < length; i++) {
        candles.o[i] += element.o[i];
      }
    }); console.log(candles);
    for (let i = 0; i < length; i++) {
      candles.o[i] = candles.o[i] / candlesList.length;
    }console.log(candles);
    candles.t = candlesList[0].t;
    candles.s = 'ok';

    shares.candles = candles;
    await this.setSharesPrice([shares]);
    return shares;
  }

  setStockPrice(stockList) {
    return Promise.all(stockList.map(async (stock) => {
      stock.code = stock.stockCode || stock.code;
      stock.price = await this.getStockPrice(stock.code);
      stock.price = Math.floor(stock.price * 100) / 100;
    }));
  }

  setSharesPrice(sharesList) {
    return Promise.all(sharesList.map(async (shares) => {
      await this.setStockPrice(shares.stockList); //console.log('price computation', shares.stockList);
      shares.price = shares.stockList.reduce((sum, shares) => sum + shares.price, 0) / shares.stockList.length; //console.log('price=', shares.price)
      shares.price = Math.floor(shares.price * 100) / 100;
    }));
  }
}

module.exports = new Prices();