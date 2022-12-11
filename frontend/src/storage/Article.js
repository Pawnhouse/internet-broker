import {makeAutoObservable} from 'mobx';

export default class ArticleInfo {
  constructor() {
    this._allArticles = [];
    makeAutoObservable(this);
  }

  get allArticles() { return this._allArticles; }
    
  set allArticles(allArticles) { this._allArticles = allArticles; }
}
