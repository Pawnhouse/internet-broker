class Person{
  constructor(obj){
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.middleName = obj.middleName;
    this.surname = obj.surname;
    this.role = obj.role;
    this.email = obj.email;
    this.password = obj.password;
    this.picture = obj.picture;
  }
}

class User extends Person{
  constructor(obj){
    super(obj)
    this.isVip = obj.isVip;
    this.balance = obj.balance;
    this.request = obj.request;
    this.stock = obj.stock;
    this.shares = obj.shares;
  }
}

class Analyst extends Person{
  constructor(obj){
    super(obj)
    this.company = obj.company;
  }
}

class Moderator extends Person{};

class Administrator extends Person{};
