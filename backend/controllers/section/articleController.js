const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');

const articleQuery = 'SELECT headline, text, sectionId, company,'
  + ' about, date, firstName, file picture'
  + ' FROM article'
  + ' INNER JOIN person ON person.id = article.personId'
  + ' INNER JOIN analyst ON analyst.personId = article.personId'
  + ' LEFT JOIN picture ON person.picture = picture.id';

function convertArticle(row) {
  const { sectionId, about, company, date, headline, text, firstName, picture } = row;
  return {
    sectionId,
    author: { firstName, company, picture },
    date,
    headline,
    text,
    about,
  }
}

class RequestController {
  async get(req, res) {
    const data = await db.query(articleQuery);
    const results = [];
    data.forEach((row) => results.push(convertArticle(row)));
    res.json(results);
  }

  create(req, res) {
    const obj = req.body;
    obj.personId = req.user.id;
    const query = db.generateInsertQuery('section', { type: 'article' });
    db.connection.query(query, async function (err, result) {
      if (err) throw err;
      await db.insertData(
        'article',
        { sectionId: result.insertId, ...obj }
      )
      const insertedRow = await db.query(articleQuery + ' WHERE sectionId = ' + result.insertId)[0];
      res.json(convertArticle(insertedRow));
    });
  }

}

module.exports = new RequestController();