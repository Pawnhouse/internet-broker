const ApiError = require('../errors/apiError');
const db = require('../../database/db');

class RequestController {
  async get(req, res) {
    let query = 'SELECT text, comment.id, CONCAT(firstName, " ", surname) name,'
      + ' sectionId, role, isVip, date, person.id personId, file picture'
      + ' FROM comment'
      + ' INNER JOIN person ON person.id = authorId' 
      + ' LEFT JOIN picture ON person.picture = picture.id'
      + ' LEFT JOIN user ON person.id = user.personId';
    const data = await db.query(query);
    const results = [];
    data.forEach((row) => {
      const { id, sectionId, name, role, date, text, personId, picture, isVip } = row;
      results.push({ 
        id, 
        author: { id: personId, name, role, picture, isVip }, 
        date, 
        text, 
        sectionId 
      });
    });
    res.json(results);
  } 

  create(req, res) {
    const obj = req.body;
    obj.authorId = req.user.id; 
    const query = db.generateInsertQuery('comment', obj);
    db.connection.query(query, async function (err, result) {
      if (err) { throw err; }
      const userResult = await db.getConditionData('user', {personId: req.user.id})
      const isVip = userResult[0]?.isVip;
      obj.author = {
        id: req.user.id,
        name: req.user.firstName + ' ' + req.user.surname,
        role: req.user.role,
        picture: req.user.picture,
        isVip
      };
      obj.id = result.insertId;
      res.json(obj);
    });
  }

  async edit(req, res) {
    const obj = {...req.body, moderatorId: req.user.id}; 
    if ( req.user.role !== 'moderator') {
      delete obj.moderatorId;
    }
    await db.updateData('comment', obj); 

    res.status(200).send();
  }

  async delete(req, res) {
    const comment = await db.getDataById('comment', req.params.id);
    await db.deleteData('comment', { id: req.params.id });
    await db.insertData('notification', {
      receiverId: comment.authorId, 
      senderId: req.user.id, 
      text: 'Your comment has been deleted.',
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    res.status(200).send();
  }
}

module.exports = new RequestController();