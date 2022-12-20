const util = require('util');
const mysql = require('mysql');

class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
    });
  }

  query(sql, args) {
    return util.promisify(this.connection.query)
      .call(this.connection, sql, args);
  }

  close() {
    return util.promisify(this.connection.end).call(this.connection);
  }

  async getKeys(table) {
    const query = 'SHOW KEYS FROM ' + table + ' WHERE Key_name = \'PRIMARY\'';
    const keys = await this.query(query);
    const keyNames = [];
    for (let i = 0; i < keys.length; i++) {
      keyNames.push(keys[i].Column_name);
    }
    return keyNames;
  }

  generateValues(row) {
    let keys = '(';
    let values = '(';
    for (const key in row) {
      keys += key + ', ';
      values += JSON.stringify(row[key]) + ', ';
    }
    if (Object.keys(row).length > 0) {
      keys = keys.slice(0, -2) + ')';
      values = values.slice(0, -2) + ')';
    } else {
      keys = '()';
      values = '()';
    }
    return [keys, values];
  }

  generateInsertQuery(table, row) {
    const [keys, values] = this.generateValues(row);
    let queryString = 'INSERT INTO ' + table + keys;
    queryString = queryString + ' VALUES ' + values;
    return queryString;
  }

  async generateUpdateQuery(table, row) {
    const keyIndices = await this.getKeys(table);
    let keys = '';
    let values = '';
    for (const key in row) {
      if (!keyIndices.includes(key)) {
        values += key + ' = ' + JSON.stringify(row[key]) + ', ';
      }
      else {
        keys += key + ' = ' + JSON.stringify(row[key]) + ' AND ';
      }
    }
    keys = keys.slice(0, -5);
    values = values.slice(0, -2);
    return 'UPDATE ' + table + ' SET ' + values + ' WHERE ' + keys;
  }

  generateCondition(condition) {
    let str = '';
    for (const key in condition) {
      str += key + ' = ' + JSON.stringify(condition[key]) + ' AND ';
    }
    if (Object.keys(condition).length > 0) {
      return ' WHERE ' + str.slice(0, -5);
    } else {
      return '';
    }
  }

  getData(table) {
    return this.query('SELECT * FROM ' + table);
  }

  async getDataById(table, id) {
    const results = await this.query('SELECT * FROM ' + table + ' WHERE id = ' + id);
    return results[0];
  }

  async getUserById(id) {
    const user = await this.getDataById('person', id);
    if (!user) {
      return null;
    }
    user.picture = await this.getDataById('picture', user.picture);
    return user;
  }

  async getConditionData(table, condition) {

    return this.query('SELECT * FROM ' + table + this.generateCondition(condition));
  }

  async insertData(table, row) {
    this.connection.query(this.generateInsertQuery(table, row));
  }

  async insertManyRows(table, rows) {
    if (rows.length === 0) {
      return;
    }
    const [keys] = this.generateValues(rows[0]);
    let queryString = 'INSERT INTO ' + table + keys;
    queryString = queryString + ' VALUES ';
    const valuesList = rows.map((row) => this.generateValues(row)[1]);
    queryString += valuesList.join();
    await this.query(queryString);
  }

  async updateData(table, row) {
    this.query(await this.generateUpdateQuery(table, row));
  }

  async findByEmail(email) {
    const user = (await this.getConditionData('person', { email }))[0];
    if (!user) {
      return null;
    }
    if (user.picture != undefined) {
      user.picture = (await this.getDataById('picture', user.picture)).file;
    }
    user.role = (await this.getDataById('role', user.role)).name;
    return user;
  }

  async deleteData(table, row) {
    const keyIndices = await this.getKeys(table);
    let keys = '';
    for (const key in row) {
      if (keyIndices.includes(key)) {
        keys += key + ' = ' + JSON.stringify(row[key]) + ' AND ';
      }
    }
    keys = keys.slice(0, -5);
    const queryString = 'DELETE FROM ' + table + ' WHERE ' + keys;
    this.query(queryString);
  }
}

module.exports = new DB();