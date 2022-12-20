const ApiError = require('../errors/apiError');
const formidable = require('formidable');
const fs = require('fs');
const db = require('../../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('../utils/mail');
const payment = require('../utils/payment');

function generateJwt({ id, role, email, firstName, middleName, surname, picture, phone }) {
  return jwt.sign({ id, role, email, firstName, middleName, surname, picture, phone }, 'key432', { expiresIn: '1h' });
}

const escapeList = ['a@a.a', 'b@b.b', 'mail@blackrock.us', 'vip@mail.com'];

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

    const oneTimePassword = Math.floor(Math.random() * 999999);
    await db.deleteData('oneTimePassword', { personId: person.id });
    await db.insertData('oneTimePassword', {
      personId: person.id,
      value: oneTimePassword,
      time: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    if (escapeList.includes(email)) {
      console.log(oneTimePassword);
    } else {
      const text = 'Your one-time password is:\n' + oneTimePassword;
      await mail(text, email);
    }
    res.status(200).send();
  }

  async loginOneTimePassword(req, res, next) {
    const { email, oneTimePassword } = req.body;
    if (!email || !oneTimePassword) {
      next(ApiError.badRequest('Fill all fields'));
      return;
    }

    const person = await db.findByEmail(email);
    const result = await db.getConditionData('oneTimePassword', { personId: person.id });
    if (result.length === 0) {
      next(ApiError.badRequest('Error your one-time password expired. Try login again.'));
      return;
    }
    if (+oneTimePassword !== result[0].value) {
      next(ApiError.badRequest('The one-time password is wrong'));
      return;
    }

    await db.deleteData('oneTimePassword', { personId: person.id });
    const token = generateJwt(person);
    res.json(token);
  }


  async register(req, res, next) {
    const { firstName, surname, email, password } = req.body;
    if (!firstName || !surname || !email || !password) {
      next(ApiError.badRequest('Fill all fields'));
      return;
    }
    if (password.length < 8) {
      next(ApiError.badRequest('Password must be at least 8 characters'));
      return;
    }
    if (password.search(/[a-zA-Z]/) === -1 || password.search(/\d/) === -1) {
      next(ApiError.badRequest('Password must contain letter and number'));
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
    user.role = 1;
    await db.insertData('person', user);

    const { id, role, middleName } = await db.findByEmail(email);
    await db.insertData('user', { personId: id, balance: 0, isVip: false });
    const token = generateJwt({ id, role, email, firstName, middleName, surname });
    res.json(token);
  }

  async deposit(req, res, next) {
    const { id, firstName, surname, email } = req.user;
    const { sum } = req.body;
    const checkout = await payment.getTokenAndUrl(
      Math.round(sum * 100), firstName, surname, email
    );
    if (!checkout) {
      next(ApiError.internal('Sorry, some error has happend'));
      return;
    }
    const { token, redirect_url } = checkout;
    await db.insertData('payment', { token, personId: id, amount: sum });
    res.json(redirect_url);
  }

  async checkDeposit(req, res) {
    const userPayment = (await db.getConditionData('payment', { personId: req.user.id }))[0]
    if (!userPayment) {
      res.status(200).send();
      return;
    }
    if (userPayment.status) {
      res.json({ status: userPayment.status });
      if (payment.status !== 'processing') {
        await db.deleteData('payment', { token: userPayment.token });
      }
      return;
    }
    await db.updateData('payment', { token: userPayment.token, status: 'processing' });
    res.status(200).send();
    const status = await payment.check(userPayment.token);

    if (status === 'successful') {
      const { balance } = (await db.getConditionData('user', { personId: req.user.id }))[0];
      await db.updateData('payment', { token: userPayment.token, status });
      await db.updateData('user', { personId: req.user.id, balance: balance + userPayment.amount, token: userPayment.token });
      const text = 'Your payment of ' + userPayment.amount + '$ was successfull';
      await db.insertData('notification', {
        receiverId: req.user.id,
        text,
        date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });

    } else if (status) {
      await db.updateData('payment', { token: userPayment.token, status });
      const text = 'Your payment of ' + userPayment.amount + '$ is failed';
      await db.insertData('notification', {
        receiverId: req.user.id,
        text,
        date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }
  }

  async withdrawal(req, res, next) {
    const { id } = req.user;
    const { sum } = req.body;
    const { balance, token } = (await db.getConditionData('user', { personId: id }))[0];
    if (balance < sum) {
      next(ApiError.badRequest('Not enough balance to withdraw'));
      return;
    }
    if (!token) {
      next(ApiError.badRequest('You have never incresed balance with a card'));
      return;
    }
    await db.updateData('user', { personId: id, balance: balance - sum });
    res.status(200).send();

    const text = 'You withdraw ' + sum + '$';
    await db.insertData('notification', {
      receiverId: id,
      text,
      date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  }

  async check(req, res, next) {
    const token = generateJwt(req.user);
    res.json(token);
  }

  async getUser(req, res) {
    const id = req.params.id;
    const userQuery = 'SELECT person.id, firstName, middleName, surname,'
      + ' email, role.name role, isVip, company, file picture'
      + ' FROM person'
      + ' INNER JOIN role ON person.role = role.id'
      + ' left JOIN user ON person.id = user.personId'
      + ' left JOIN analyst ON person.id = analyst.personId'
      + ' left JOIN picture ON picture = picture.id';
    if (id == null) {
      res.json(await db.getData('user_data'));
    } else {
      res.json((await db.getConditionData('user_data', { id }))[0]);
    }
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
      if (password.length < 8) {
        next(ApiError.badRequest('Password must be at least 8 characters'));
        return;
      }
      if (password.search(/[a-zA-Z]/) === -1 || password.search(/\d/) === -1) {
        next(ApiError.badRequest('Password must contain letter and number'));
        return;
      }
      req.body.password = bcrypt.hashSync(password, 12);
    }

    if (req.body.role != null) {
      req.body.role = (await db.getConditionData('role', { name: req.body.role }))[0].id;
    }
    if (req.body.role == 1) {
      await db.updateData('user', { personId: req.body.id, isVip: false});
    }
    await db.updateData('person', req.body);

    const user = await db.getDataById('person', req.body.id);
    if (user.picture != undefined) {
      user.picture = (await db.getDataById('picture', user.picture)).file;
    }
    user.role = (await db.getDataById('role', user.role)).name;
    const token = generateJwt(user);
    res.json(token);
  }

  async setCompany(req, res, next) {
    await db.updateData('analyst', { personId: req.user.id, company: req.body.company });
    res.status(200).send();
  }

  async getSimpleUserData(req, res) {
    const data = (await db.getConditionData('user', { personId: req.user.id }))[0];
    res.json(data);
  }

  async getCompany(req, res) {
    const data = (await db.getConditionData('analyst', { personId: req.user.id }))[0];
    res.json(data?.company);
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
          return;
        }

        const file = results.insertId + regex[0];
        await db.updateData('picture', { id: results.insertId, file: file });
        await db.updateData('person', { id: personId, picture: results.insertId });

        const newpath = process.env.STATIC_FILES_PATH + file;
        fs.copyFile(oldpath, newpath, function (err) {
          if (err) {
            next(ApiError.internal('File download error'));
            return;
          }
          res.status(200).send();
        });
      });

    });
  }
}

module.exports = new PersonController();