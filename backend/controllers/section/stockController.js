const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');

class StockController {
  async get(req, res) {
    const data = await db.getData('stock');
    res.json(data);
  }

  async getCount(req, res) {
    const data = await db.getConditionData('usersStock', {personId: req.user.id, stockCode: req.query.stockCode});
    if (data.length > 0) {
      res.json(data[0].number);
    } else {
      res.json(0);
    }
  }

  async put(req, res) {
    const obj = req.body;
    const { code, description, isActive } = obj;
    const existingStock = (await db.getConditionData('stock', { code }))[0];

    if (!existingStock) {
      const query = await db.generateInsertQuery('section', { description });
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