import { $authHost } from ".";


export async function getDescription(id) {
  const { data } = await $authHost.get('/api/section/', { params: { id } });
  return data;
}

export async function getPicture(id) {
  const { data } = await $authHost.get('/api/picture/', { params: { id } });
  return data;
}

export async function getArticles() {
  const { data } = await $authHost.get('/api/article/');
  data.forEach((article) => {
    article.date = new Date(article.date);
  }); 
  return data;
}

export async function createArticle(
  headline, text, about, date = new Date().toISOString().slice(0, 19).replace('T', ' ')
) {
  const { data } = await $authHost.post(
    '/api/article/create',
    { headline, text, about, date }
  );
  data.date = new Date(data.date);
  return data;
}