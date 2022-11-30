import {makeAutoObservable} from 'mobx';

export default class UserInfo {
  constructor() {
    this._isAuthenticated = false;
    this._user = null;
    makeAutoObservable(this);
  }

  get isAuthenticated() { return this._isAuthenticated; }
  
  get user() { return this._user; }
    
  set user(user) { this._user = user; }
  
  set isAuthenticated(isAuthenticated) { this._isAuthenticated = isAuthenticated; }
}