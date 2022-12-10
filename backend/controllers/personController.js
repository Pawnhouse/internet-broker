const ApiError = require('../errors/apiError');
const formidable = require('formidable');
const fs = require('fs');
const db = require('../../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Person } = require('../../database/models/person');

function generateJwt({ id, role, email, firstName, middleName, surname, picture }) {
  return jwt.sign({ id, role, email, firstName, middleName, surname, picture }, 'key432', { expiresIn: '1h' });
}

class PersonController {

  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      next(ApiError.badRequest('Fill all fields'));
      return;
    }

    const person = await db.findByEmail(email);
    if (!person) {
      next(ApiError.badRequest('Email does not exist'));
      return;
    }
    if (!bcrypt.compareSync(password, person.password)) {
      next(ApiError.badRequest('The password is wrong'));
      return;
    }
    const token = generateJwt(person);
    res.json(token);
  }

  async register(req, res, next) {
    const { firstName, surname, email, password } = req.body;
    if (!firstName || !surname || !email || !password) {
      next(ApiError.badRequest('Fill all fields'));
      return;
    }
    let person = await db.findByEmail(email);
    if (person) {
      next(ApiError.badRequest('Email already exists'));
      return;
    }

    const hash = bcrypt.hashSync(password, 12);
    const user = new Object(req.body);
    user.password = hash;
    user.role = 'user';
    await db.insertData('person', user);

    const { id, role, middleName } = await db.findByEmail(email);
    await db.insertData('user', { personId: id, balance: 0, isVip: false });
    const token = generateJwt({ id, role, email, firstName, middleName, surname });
    res.json(token);
  }

  async deposit(req, res) {
    const { id } = req.user;
    const { sum } = req.body;
    const { balance } = (await db.getConditionData('user', { personId: id }))[0];
    await db.updateData('user', { personId: id, balance: balance + sum });
    res.json(balance + sum);
  }

  async withdrawal(req, res, next) {
    const { id } = req.user;
    const { sum } = req.body;
    const { balance } = (await db.getConditionData('user', { personId: id }))[0];
    if (balance < sum) {
      next(ApiError.badRequest('Not enough balance to withdraw'));
      return;
    }
    await db.updateData('user', { personId: id, balance: balance - sum });
    res.json(balance - sum);
  }

  async check(req, res, next) {
    const token = generateJwt(req.user);
    res.json(token);
  }

  async updateUser(req, res, next) {
    const { email, password } = req.body;
    if (email) {
      let person = await db.findByEmail(email);
      if (!person) {
        next(ApiError.badRequest('Email already exists'));
        return;
      }
    }
    if (password) {
      req.body.password = bcrypt.hashSync(password, 12);
    }
    await db.updateData('person', req.body);
    const user = await db.getDataById('person', req.body.id);
    const token = generateJwt(user);
    res.json(token);
  }

  async getSimpleUserData(req, res) {
    const data = (await db.getConditionData('user', {personId: req.user.id}))[0];
    res.json(data);
  }

  async addPicture(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const personId = +fields.id;
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
        }

        const file = results.insertId + regex[0];
        await db.updateData('picture', { id: results.insertId, file: file });
        await db.updateData('person', { id: personId, picture: results.insertId });

        const newpath = 'D:/ТОФИ/internet-broker/backend/static/' + file;
        fs.copyFile(oldpath, newpath, function (err) {
          if (err) {
            next(ApiError.internal('File download error'));
          }
          res.status(200).send();
        });
      });

    });
  }
}

module.exports = new PersonController();