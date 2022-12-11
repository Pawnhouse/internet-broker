const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');
const prices = require('../../prices');

async function processSharesName(req, next) {
  const sharesName = req.body.sharesName || req.query.sharesName;
  if (!sharesName) {
    next(ApiError.badRequest('Shares name is required'));
    return;
  }
  const shares = (await db.getConditionData('shares', { sharesName, isActive: true }))[0];
  if (!shares) {
    next(ApiError.badRequest('This shares is not available'));
    return;
  }

  const personId = req.user.id;
  shares.stockList = await db.getConditionData('sharesStock', { sharesName: shares.sharesName });
  await prices.setSharesPrice([shares]);
  if (shares.price == null) {
    next(ApiError.badRequest('Network error, can not compute price'));
    return;
  }
  const balance = (await db.getConditionData('user', { personId }))[0]?.balance;
  return [sharesName, shares, personId, balance];
}


class SharesController {
  async get(req, res) {
    const data = await db.getData('shares');
    await Promise.all(data.map(async (shares) => {
      shares.stockList = await db.getConditionData('sharesStock', { sharesName: shares.sharesName });
    }));
    await prices.setSharesPrice(data);
    res.json(data);
  }

  async getCount(req, res) {
    const data = await db.getConditionData('usersShares', { personId: req.user.id, sharesName: req.query.sharesName });
    if (data.length > 0) {
      res.json(data[0].number);
    } else {
      res.json(0);
    }
  }

  async getCandles(req, res, next) {
    const result = await processSharesName(req, next);
    if (!result) {
      return;
    }
    const [sharesName, shares] = result;
    const data = await prices.getSharesCandles(shares);
    res.json(data);
  }

  async buy(req, res, next) {
    const result = await processSharesName(req, next);
    if (!result) {
      return;
    }
    const [sharesName, shares, personId, balance] = result;

    if (balance < shares.price) {
      next(ApiError.badRequest('Not enough balance to buy'));
      return;
    }
    const newBalance = Math.round((balance - shares.price) * 100) / 100;
    await db.updateData('user', { personId, balance: newBalance});

    const data = await db.getConditionData('usersShares', { personId, sharesName });
    let number;
    if (data.length > 0) {
      number = data[0].number + 1;
      await db.updateData('usersShares', { personId, sharesName, number });
    } else {
      number = 1;
      await db.insertData('usersShares', { personId, sharesName, number });
    }
    res.json({ number, balance: newBalance});
  }

  async sell(req, res, next) {
    const result = await processSharesName(req, next);
    if (!result) {
      return;
    }
    const [sharesName, shares, personId, balance] = result;
    const newBalance = Math.round((balance + shares.price) * 100) / 100;


    const data = await db.getConditionData('usersShares', { personId, sharesName });
    let number;
    if (data.length > 0 && data[0].number > 0) {
      number = data[0].number - 1;
      await db.updateData('usersShares', { personId, sharesName, number });
    } else {
      next(ApiError.badRequest('You dont have shares'));
      return;
    }

    await db.updateData('user', { personId, balance: newBalance });
    res.json({ number, balance: newBalance });
  }

  async put(req, res, next) {
    const obj = req.body;
    const { sharesName, description, stockList, isActive } = obj;
    const existingShares = (await db.getConditionData('shares', { sharesName }))[0];

    if (stockList.length === 0) {
      next(ApiError.badRequest('No stock submitted'));
    }
    const allStock = (await db.getData('stock')).map(stock => stock.code);
    let isError = false;
    stockList.forEach(stockCode => {
      if (!allStock.includes(stockCode)) {
        isError = true;
      }
    });
    if (isError) {
      next(ApiError.badRequest('Submitted stock does not exist'));
      return;
    }

    await db.deleteData('sharesStock', { sharesName });
    if (!existingShares) {
      const query = db.generateInsertQuery('section', { description, type: 'shares' });
      db.connection.query(query, async function (err, result) {
        if (err) throw err;
        await db.insertData(
          'shares',
          { sectionId: result.insertId, sharesName, isActive }
        )
        try {
          await db.insertManyRows('sharesStock', stockList.map((stockCode) => ({ stockCode, sharesName })));
        } finally {
          res.status(200).send();
        }
      });

    } else {
      existingShares.isActive = obj.isActive;
      await db.updateData('shares', existingShares);
      const section = { id: existingShares.sectionId, description, type: 'shares' };
      await db.updateData('section', section);
      try {
        await db.insertManyRows('sharesStock', stockList.map((stockCode) => ({ stockCode, sharesName })));
      } finally {
        res.status(200).send();
      }
    }

  }
}

module.exports = new SharesController();