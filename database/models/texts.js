class Request{
  constructor(role, personId, date=Date()){
    this.role = role;
    this.personId = personId;
    this.date = date;
  }
}

class Notification{
  constructor(text, sender, receiver, date=Date()){
    this.text = text;
    this.sender = sender;
    this.receiver = receiver;
    this.date = date;
  }
}

class Comment{
  constructor(id, text, moderator, author, section, date=Date()){
    this.id = id;
    this.text = text;
    this.moderator = moderator;
    this.author = author;
    this.section = section;
    this.date = date;
  }
}