const ApiError = require('../errors/apiError');
const db = require('../../database/db');

class RequestController {
  async get(req, res) {
    let query = 'SELECT request.id, CONCAT(firstName, " ", surname) name, personId, request.role, date'
      + ' FROM request INNER JOIN person ON person.id = request.personId';
    if (req.query.personId !== undefined) {
      query += ' WHERE person.id = ' + req.query.personId;
    }

    const data = await db.query(query);
    const results = [];
    data.forEach((row) => {
      const { id, personId, name, role, date } = row;
      results.push({ id, person: { id: personId, name }, role, date })
    });
    res.json(results);
  }

  async getNotifications(req, res) {
    const data = await db.getConditionData('notification', { receiverId: req.user.id });
    await Promise.all(data.map(async (row) => {
      if (row.senderId != null) {
        row.sender = await db.getUserById(row.senderId);
        row.sender.name = row.sender.firstName + ' ' + row.sender.surname;
        row.receiver = { id: row.receiverId }
      }
    }));
    res.json(data);
  }

  async create(req, res) {
    const obj = req.body;
    await db.insertData('request', obj);
    res.status(200).send();
  }

  async dismiss(req, res) {
    res.status(200).send();
    db.deleteData('request', { id: req.body.id });
  }

  async approve(req, res) {
    res.status(200).send();
    const userRequest = await db.getDataById('request', req.body.id);
    if (userRequest.role == 'vip') {
      const user = (await db.getConditionData('user', { personId: userRequest.personId }))[0];
      user.isVip = true;
      db.updateData('user', user);
      return;
    }
    db.insertData(userRequest.role, { personId: userRequest.personId });
    db.updateData('person', { id: userRequest.personId, role: userRequest.role });
    db.deleteData('request', { id: req.body.id });
  }
}

module.exports = new RequestController();