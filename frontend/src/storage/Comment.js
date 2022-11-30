import { makeAutoObservable } from 'mobx';
import pic from '../img/standard.jpg';

export default class CommentInfo {
  constructor() {
    this._allComments = [
      { id: 1, section: { id: 1 }, text: 'Hello. some comment text', author: { firstName: 'no', surname: 'non', role: 'user', isVip: true }, date: new Date() },
      { id: 2, section: { id: 1 }, text: 'Hello. some comment text', author: { firstName: 'no', surname: 'non', role: 'user', isVip: true, picture: pic }, date: new Date() },
      { id: 3, section: { id: 2 }, text: 'Hello. some comment text', author: { firstName: 'no', surname: 'non', role: 'user', isVip: true, picture: pic }, date: new Date() },
    ];
    this._currentSection = null;
    makeAutoObservable(this);
  }

  deleteComment(comment) {
    const i = this._allComments.indexOf(comment);
    delete this._allComments[i];
  }

  changeComment(comment) {
    for (let i = 0; i < this._allComments.length; i++) {
      if (this._allComments[i].id === comment.id) {
        this._allComments[i] = comment;
      }
    }
  }

  addComment(comment) { this._allComments.push(comment); }

  get currentSectionComments() {
    return this._allComments.filter(((value) => value.section.id === this._currentSection.id));
  }

  set currentSection(currentSection) { this._currentSection = currentSection; }
}
