import { getShares, getStock } from '../http/stockAPI';

function allActive(stockInfo) {
  return stockInfo.allStock.concat(stockInfo.allShares).filter(item => item.isActive);
}

export default async function stockLoad(stockInfo) {
  if (stockInfo.isLoaded) {
    if (!stockInfo.currentStock) {
      stockInfo.currentStock = allActive(stockInfo)[0];
    }
    return;
  }
  try {
    stockInfo.allStock = await getStock();
    stockInfo.allShares = await getShares(); 
    stockInfo.currentStock = allActive(stockInfo)[0];
  } catch (err) {
    console.error(err);
  }
  stockInfo.isLoaded = true;
}