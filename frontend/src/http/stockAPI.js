import { $authHost } from ".";

export async function createStock(
  code, description, isActive = true
) {
  await $authHost.put(
    '/api/stock',
    { code, description, isActive }
  );
}

export async function createShares(
  sharesName, stockList, description, isActive = true,
) {
  await $authHost.put(
    '/api/shares',
    { sharesName, stockList, description, isActive }
  );
}

export async function activate(id, type, isActive) {
  const request = isActive ? '/enable' : '/disable';
  await $authHost.patch('/api/' + type + request, { sectionId: id });
}

export async function getStock() {
  const { data } = await $authHost.get('/api/stock');
  return data;
}

export async function getShares() {
  const { data } = await $authHost.get('/api/shares');
  return data;
}

export async function getStockNumber(section) {
  let data;
  if (section.code) {
    const res = await $authHost.get(
      '/api/stock/count',
      { params: { stockCode: section.code } }
    );
    data = res.data;

  }
  if (section.sharesName) {
    const res = await $authHost.get(
      '/api/shares/count',
      { params: { sharesName: section.sharesName } }
    );
    data = res.data;
  }
  return data;
}