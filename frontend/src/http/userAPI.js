import { $host, $authHost } from ".";
import jwt_decode from 'jwt-decode';

export async function register(
  email, password, firstName, middleName, surname,
) {
  const { data } = await $host.post(
    '/api/person/register',
    { email, password, firstName, middleName, surname, }
  );
  localStorage.setItem('token', data);
  return jwt_decode(data);
}

export function login(email, password) {
  return $host.post(
    '/api/person/login',
    { email, password }
  );
}

export async function loginOneTimePassword(email, oneTimePassword) {
  const { data } = await $host.post(
    '/api/person/one-time',
    { email, oneTimePassword }
  );
  localStorage.setItem('token', data);
  return jwt_decode(data);
}

export async function check() {
  const { data } = await $authHost.get('/api/person/auth');
  localStorage.setItem('token', data);
  return jwt_decode(data);
}

export async function updateUser(user) {
  const { data } = await $authHost.patch('/api/person/', user);
  localStorage.setItem('token', data);
  return jwt_decode(data);
}

export function updateRole(id, role) {
  return $authHost.patch('/api/person/', {id, role});
}

export async function newPicture(formData) {
  await $authHost.patch('api/person/picture', formData);
}

export async function getBalance() {
  const { data } = await $authHost.get('/api/person/user-data');
  return data.balance;
}

export async function getIsVip() {
  const { data } = await $authHost.get('/api/person/user-data');
  return data.isVip;
}

export async function makeTransaction(sum, isDeposit) {
  if (isDeposit) {
    const { data } = await $authHost.post('api/person/deposit', { sum });
    return data;
  } else {
    await $authHost.post('api/person/withdrawal', { sum });
  }
}

export async function checkDeposit() {
  const { data } = await $authHost.get('/api/person/check-deposit');
  return data.status;
}

export async function getCompany() {
  const { data } = await $authHost.get('/api/person/company');
  return data;
}

export async function updateCompany(company) {
  await $authHost.post('/api/person/company', { company });
}

export async function getUser(personId='') {
  const { data } = await $authHost.get('/api/person/' + personId);
  return data;
}