import {makeAutoObservable} from 'mobx';

export default class ArticleInfo {
  constructor() {
    this._allArticles = [];
    this._isDeleted = false;
    makeAutoObservable(this);
  }

  get allArticles() { return this._allArticles; }
    
  set allArticles(allArticles) { this._allArticles = allArticles; }

  get isDeleted() { return this._isDeleted; }
    
  set isDeleted(isDeleted) { this._isDeleted = isDeleted; }
}
