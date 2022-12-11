import {makeAutoObservable} from 'mobx';

export default class StockInfo {
  constructor() {
    this._isLoaded = false;
    this._allStock = [];
    this._allShares = [];
    this._currentStock = null;
    makeAutoObservable(this);
  }

  get allStock() { return this._allStock; }
    
  set allStock(allStock) { this._allStock = allStock; }

  get allShares() { return this._allShares; }

  set allShares(allShares) { this._allShares = allShares; }

  get currentStock() { return this._currentStock; }
    
  set currentStock(currentStock) { this._currentStock = currentStock; }
  
  updateIsActive(sectionId, isActive) {
    let section = null;
    const all = this._allStock.concat(this._allShares);
    for (let i in all) {
      if (all[i].sectionId === sectionId) {
        section = all[i];
      }
    }
    if (! section.currentStock?.isActive) {
      section.currentStock = all.filter(s => s.isActive)[0];
    }
    section.isActive = isActive; // for observer
  }

  get isLoaded() { return this._isLoaded; }
    
  set isLoaded(isLoaded) { this._isLoaded = isLoaded; }
}
