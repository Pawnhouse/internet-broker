const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');
const prices = require('../../utils/prices');

class SectionController {

  async get(req, res, next) {
    const data = await db.getDataById('section', req.query.id);
    if (!data) {
      next(ApiError.badRequest('No such section'));
      return;
    }
    res.json(data.description);
  }

  async getPortfolio(req, res) {
    const personId = req.user.id;
    const stockQuery = (
      'SELECT code, sectionId, number FROM usersStock '
      + 'INNER JOIN stock ON code = stockCode '
      + 'WHERE number > 0 and personId = '
      + personId
    );
    const sharesQuery = (
      'SELECT shares.sharesName, sectionId, number FROM usersShares '
      + 'INNER JOIN shares ON shares.sharesName = usersShares.sharesName '
      + 'WHERE number > 0 and personId = '
      + personId
    );
    
    const userStockList = await db.query(stockQuery);
    const userSharesList = await db.query(sharesQuery);
    await Promise.all(userSharesList.map(async (shares) => {
      shares.stockList = await db.getConditionData('sharesStock', { sharesName: shares.sharesName });
    }));
    await prices.setStockPrice(userStockList);
    await prices.setSharesPrice(userSharesList);
    res.json(userSharesList.concat(userStockList));
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

module.exports = new SectionController();