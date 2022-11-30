import { $authHost } from ".";


export async function getDescription(id) {
  const { data } = await $authHost.get('/api/section/', { params: { id } });
  return data;
}

export async function getPicture(id) {
  const { data } = await $authHost.get('/api/picture/', { params: { id } });
  return data;
}