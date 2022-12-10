import { getShares, getStock } from '../http/stockAPI';


export default async function stockLoad(stockInfo) {
  if (stockInfo.isLoaded) {
    if (!stockInfo.currentStock) {
      stockInfo.currentStock = stockInfo.allActiveStock[0] || stockInfo.allActiveShares[0];
    }
    return;
  }
  try {
    stockInfo.allStock = await getStock();
    stockInfo.allShares = await getShares(); 
    stockInfo.currentStock = stockInfo.allActiveStock[0] || stockInfo.allActiveShares[0];
  } catch (err) {
    console.error(err);
  }
  stockInfo.isLoaded = true;
}