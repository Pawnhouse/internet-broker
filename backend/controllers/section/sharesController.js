const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');

class SharesController {
  async get(req, res) {
    const data = await db.getData('shares');
    res.json(data);
  }

  async getCount(req, res) {
    const data = await db.getConditionData('usersShares', {personId: req.user.id, sharesName: req.query.sharesName});
    if (data.length > 0) {
      res.json(data[0].number);
    } else {
      res.json(0);
    }
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
      const query = db.generateInsertQuery('section', { description });
      db.connection.query(query, async function (err, result) {
        if (err) throw err;
        await db.insertData(
          'shares',
          { sectionId: result.insertId, sharesName, isActive }
        )
        try {
          await db.insertManyRows('sharesStock', stockList.map((stockCode) => { stockCode, sharesName }));
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