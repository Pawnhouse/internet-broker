const ApiError = require('../errors/apiError');
const db = require('../../database/db');
const mail = require('../utils/mail');

class RequestController {
  async get(req, res) {
    let query = 'SELECT request.id, CONCAT(firstName, " ", surname) name, personId, role.name role, date'
      + ' FROM request INNER JOIN person ON person.id = request.personId'
      + ' INNER JOIN role ON request.role = role.id';
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

  async postNotification(req, res, next) { 
    const escapeList = ['a@a.a', 'b@b.b', 'mail@blackrock.us', 'vip@mail.com'];

    if(!req.body.userId) {
      next(ApiError.badRequest('user is not specified'));
      return;      
    }
    const data = await db.getConditionData('person', { id: req.body.userId });
    if (data.length == 0) {
      next(ApiError.badRequest('user is not exists'));
      return;
    }

    const email = data[0].email;
    if (!escapeList.includes(email)) {
      const from = `Notification from ${req.user.firstName} ${req.user.surname}:\n`;
      mail(req.body.text, email, from);
    }

    await db.insertData('notification', {
      receiverId: req.body.userId, 
      senderId: req.user.id, 
      text: req.body.text,
      date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    res.status(200).send();
  }

  async create(req, res) {
    const obj = req.body;
    if (obj.role == null) {
      ApiError.badRequest('role is required');
      return;
    }
    const role = (await db.getConditionData('role', {name: obj.role}))[0]?.id;
    if( role == null ) {
      ApiError.badRequest('role is not correct');
      return;
    }
    obj.role = role;
    await db.insertData('request', obj);
    res.status(200).send();
  }

  async dismiss(req, res) {
    res.status(200).send();
    db.deleteData('request', { id: req.body.id });
  }

  async approve(req, res) {
    const userRequest = await db.getDataById('request', req.body.id);
    let role = (await db.getConditionData('role', { id: userRequest.role}))[0].name;
    if (role == 'vip' || role == 'user') {
      const user = (await db.getConditionData('user', { personId: userRequest.personId }))[0];
      user.isVip = role == 'vip';
      await db.updateData('user', user);
      role = 'user';
    }

    const list = await db.getConditionData(role, { personId: userRequest.personId });
    if (list.length === 0) {
      await db.insertData(role, { personId: userRequest.personId });
    }
    await db.updateData('person', { id: userRequest.personId, role: userRequest.role });
    await db.deleteData('request', { id: req.body.id });
    res.status(200).send();
  }
}

module.exports = new RequestController();