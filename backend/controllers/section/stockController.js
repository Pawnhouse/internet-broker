const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');
const prices = require('../../utils/prices');


async function processStockCode(req, next) {
  const stockCode = req.body.stockCode;
  if (!stockCode) {
    next(ApiError.badRequest('Stock code is required'));
    return;
  }
  if ((await db.getConditionData('stock', { code: stockCode, isActive: true })).length == 0){
    next(ApiError.badRequest('This stock is not available'));
    return;
  }

  const personId = req.user.id;
  const price = await prices.getStockPrice(stockCode);
  if (price == null) {
    next(ApiError.badRequest('Network error, can not compute price'));
    return;
  }
  const { balance } = (await db.getConditionData('user', { personId }))[0];
  return [stockCode, personId, price, balance];
}

class StockController {
  async get(req, res) {
    const data = await db.getData('stock');
    await Promise.all(data.map(async (stock) => {
      stock.price = await prices.getStockPrice(stock.code);
    }));
    res.json(data);
  }

  async getCount(req, res) {
    const data = await db.getConditionData('usersStock', { personId: req.user.id, stockCode: req.query.stockCode });
    if (data.length > 0) {
      res.json(data[0].number);
    } else {
      res.json(0);
    }
  }

  async getCandles(req, res) {
    res.json(await prices.getStockCandles(req.query.stockCode));
  }

  async buy(req, res, next) {
    const result = await processStockCode(req, next);
    if(!result) {
      return;
    }
    const [stockCode, personId, price, balance] = result;
    if (balance < price) {
      next(ApiError.badRequest('Not enough balance to buy'));
      return;
    }
    const newBalance = Math.round((balance - price) * 100) / 100;
    await db.updateData('user', { personId, balance: newBalance });

    const data = await db.getConditionData('usersStock', { personId, stockCode });
    let number;
    if (data.length > 0) {
      number = data[0].number + 1;
      await db.updateData('usersStock', { personId, stockCode, number });
    } else {
      number = 1;
      await db.insertData('usersStock', { personId, stockCode, number });
    }
    res.json({ number, balance: newBalance });
  }

  async sell(req, res, next) {
    const result = await processStockCode(req, next);
    if(!result) {
      return;
    }
    const [stockCode, personId, price, balance] = result;
    const newBalance = Math.round((balance + price) * 100) / 100;
    
    const data = await db.getConditionData('usersStock', { personId, stockCode });
    let number;
    if (data.length > 0 && data[0].number > 0) {
      number = data[0].number - 1;
      await db.updateData('usersStock', { personId, stockCode, number });
    } else {
      next(ApiError.badRequest('Short selling is not available'));
      return;
    }

    await db.updateData('user', { personId, balance: newBalance });
    res.json({ number, balance: newBalance });
  }

  async put(req, res) {
    const obj = req.body;
    const { code, description, isActive } = obj;
    const existingStock = (await db.getConditionData('stock', { code }))[0];

    if (!existingStock) {
      const query = db.generateInsertQuery('section', { description, type: 'stock' });
      db.connection.query(query, function (err, result) {
        if (err) throw err;
        db.insertData(
          'stock',
          { sectionId: result.insertId, code, isActive }
        ).then(() => { res.status(200).send(); });
      });
      return;
    }

    existingStock.isActive = obj.isActive;
    await db.updatetData('stock', existingStock);
    const section = { id: existingStock.sectionId, description, type: 'stock' };
    await db.updatetData('section', section);
    res.status(200).send();
  }
}

module.exports = new StockController();