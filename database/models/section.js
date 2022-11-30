class Section {
  constructor(id) {
    this.id = id;
  }
}

class Article extends Section {
  constructor(id, headline, text, about, author, date=Date()){
    super(id);
    this.headline = headline;
    this.text = text;
    this.about = about;
    this.author = author;
    this.date = date;
  }
}

class Stock extends Section {
  constructor(id, code, text, isActive) {
    super(id);
    this.code = code;
    this.text = text;
    this.isActive = isActive;
  }
}

class Shares extends Section {
  constructor(id, sharesId, text, stock, isActive) {
    super(id);
    this.sharesId = sharesId;
    this.text = text;
    this.isActive = isActive;
    this.stock = stock;
  }
}

class Users_stock {
  constructor(number, stock) {
    this.number = number;
    this.stock = stock;
  }
}

class Users_shares {
  constructor(number, shares) {
    this.number = number;
    this.shares = shares;
  }
}
