import {makeAutoObservable} from 'mobx';

export default class ArticleInfo {
  constructor() {
    this._allArticles = [
      {sectionId: 1, text: 'Hello. some text', heading: 'Some news about company', author: {company: 'Company'}, date: new Date()},
      {sectionId: 2, text: 'Hello. some text', heading: 'Some bad news about company2', author: {company: 'Company2'}, date: new Date()},
    ];
    this._currentArticle = null;
    makeAutoObservable(this);
  }

  get allArticles() { return this._allArticles; }
    
  set allArticles(allArticles) { this._allArticles = allArticles; }

  get currentArticle() { return this._currentArticle; }
    
  set currentArticle(currentArticle) { this._currentArticle = currentArticle; }
}
