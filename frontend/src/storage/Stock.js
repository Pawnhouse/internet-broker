import {makeAutoObservable} from 'mobx';

export default class StockInfo {
  constructor() {
    this._allStock = [];
    this._allShares = [];
    this._selectedType = ['stock', 'stock', 'stock'];
    this._currentStock = null;
    this._isActive = true;
    this._modes = ['normal', 'suspend', 'activate'];
    this._mode = 0;
    makeAutoObservable(this);
  }

  get allStock() { return this._allStock; }

  get allActiveStock() {
    return this._allStock.filter((value) => !this._isActive ^ value.isActive);
  }
    
  set allStock(allStock) { this._allStock = allStock; }

  get allShares() { return this._allShares; }

  get allActiveShares() {
    return this._allShares.filter((value) => !this._isActive ^ value.isActive);
  }
    
  set allShares(allShares) { this._allShares = allShares; }

  get selectedType() { return this._selectedType[this._mode]; }
    
  set selectedType(selectedType) { this._selectedType[this._mode] = selectedType; }

  get currentStock() { return this._currentStock; }
    
  set currentStock(currentStock) { this._currentStock = currentStock; }
  
  get mode() { return this._modes[this._mode]; }

  set mode(mode) { 
    this._isActive = ['normal', 'suspend'].includes(mode); 
    this._mode = this._modes.indexOf(mode);
  }

  get isActive() { return this._isActive; }

  updateIsActive(sectionId, isActive) {
    let section = null;
    const all = this._allStock.concat(this._allShares);
    for (let i in all) {
      if (all[i].sectionId === sectionId) {
        section = all[i];
      }
    }
    section.isActive = isActive;
  }
}
