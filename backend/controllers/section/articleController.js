const ApiError = require('../../errors/apiError');
const db = require('../../../database/db');
const formidable = require('formidable');
const fs = require('fs');


const articleQuery = 'SELECT headline, sectionId, company,'
  + ' about, isClosed, date, firstName, file picture'
  + ' FROM article'
  + ' INNER JOIN person ON person.id = article.personId'
  + ' INNER JOIN analyst ON analyst.personId = article.personId'
  + ' LEFT JOIN picture ON person.picture = picture.id';

const textQuery = 'SELECT articleText.id, text, file picture FROM articleText'
  + ' LEFT JOIN picture ON articleText.picture = picture.id'
  + ' WHERE sectionId = ? ORDER BY number';


async function convertArticle(row) {
  const { sectionId, about, isClosed, company, date, headline, firstName, picture } = row;
  const content = await db.query(textQuery, [sectionId]);
  return {
    sectionId,
    author: { firstName, company, picture },
    date,
    headline,
    about,
    isClosed,
    content
  }
}



class RequestController {
  async get(req, res) {
    const data = await db.query(articleQuery);
    const results = [];
    await Promise.all(data.map(async (row) => results.push(await convertArticle(row))));
    res.json(results);
  }

  async write(req, res) {
    const obj = req.body;
    obj.personId = req.user.id;
    if (obj.about === '') {
      delete obj.about;
    }

    if (obj.sectionId == null) {
      const query = db.generateInsertQuery('section', { type: 'article' });
      db.connection.query(query, async function (err, result) {
        if (err) throw err;
        const insertObj = { sectionId: result.insertId, ...obj }
        delete insertObj.text;
        delete insertObj.formData;

        await db.insertData('article', insertObj); 
        await db.insertData('articleText', { sectionId: result.insertId, text: obj.text, number: 0 });
        const insertedRow = (await db.query(articleQuery + ' WHERE sectionId = ' + result.insertId))[0]; 
        res.json(await convertArticle(insertedRow)); 
      });
    } else {
      const countQuery = 'SELECT count(*) number FROM articleText WHERE sectionId = ' + obj.sectionId;
      const { number } = (await db.query(countQuery))[0];
      await db.insertData('articleText', { sectionId: obj.sectionId, number, text: obj.text});
      const article = (await db.query(articleQuery + ' WHERE sectionId = ' + obj.sectionId))[0]; 
      res.json(await convertArticle(article));
    }
  }

  async editText(req, res) {
    await db.updateData('articleText', req.body);
    res.status(200).send(); 
  }  

  async delete(req, res) {
    const sectionId = +req.params.id;
    await db.query('DELETE FROM comment WHERE sectionId = ' + sectionId);
    await db.query('DELETE FROM articleText WHERE sectionId = ' + sectionId);
    await db.deleteData('article', { sectionId });
    res.status(200).send();
  }

  async addPicture(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const sectionId = +fields.id;
      const { number } = (await db.query('SELECT count(*) number FROM articleText WHERE sectionId = ' + sectionId))[0]; 
      const oldpath = files.filetoupload.filepath;
      const query = db.generateInsertQuery('picture', {});
      const regex = files.filetoupload.originalFilename.match(/\.[^\.]*$/);
      if (!regex || regex.length === 0) {
        next(ApiError.badRequest('Wrong file extension'));
        return;
      }
  
      db.connection.query(query, async function (err, results) {
        if (err) {
          next(ApiError.internal('Database error'));
          return;
        }
  
        const file = results.insertId + regex[0];
        await db.updateData('picture', { id: results.insertId, file: file });
        await db.insertData('articleText', { sectionId, picture: results.insertId, number });
  
        const newpath = process.env.STATIC_FILES_PATH + file;
        fs.copyFile(oldpath, newpath, function (err) { console.log('fs error', err);});
        res.status(200).send();
      });
  
    });
  }
}

module.exports = new RequestController();