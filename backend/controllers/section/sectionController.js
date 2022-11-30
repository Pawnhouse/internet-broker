const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');

class StockController {

  async get(req, res, next) {
    const data = await db.getDataById('section', req.query.id);
    if (!data) {
      next(ApiError.badRequest('No such section'));
      return;
    }
    res.json(data.description);
  }

  activation(activate, type) {
    return async function (req, res, next) {
      const obj = req.body; 
      const { sectionId } = obj;
      try {
        const existingStock = (await db.getConditionData(type, { sectionId }))[0];
        existingStock.isActive = activate;
        await db.updateData(type, existingStock);
      } catch {
        next(ApiError.badRequest('Stock or shares doesn\'t exist'));
        return;
      }
      res.status(200).send();
    }
  }

}

module.exports = new StockController();