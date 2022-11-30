import { $authHost } from ".";


export async function createRequest(
  personId, role, date = new Date().toISOString().slice(0, 19).replace('T', ' ')
) {
  const { data } = await $authHost.post(
    '/api/request/create',
    { personId, role, date }
  );
  return data;
}

export async function getRequests() {
  const { data } = await $authHost.get('/api/request/');
  data.forEach((request) => request.date = new Date(request.date));
  return data;
}

export async function getPersonRequests({ id }) {
  const { data } = await $authHost.get('/api/request/', { params: { personId: id } });
  return data;
}

export async function dismissRequest(request) {
  await $authHost.post('/api/request/dismiss', { id: request.id });
}

export async function approveRequest(request) {
  await $authHost.post('/api/request/approve', { id: request.id });
}

