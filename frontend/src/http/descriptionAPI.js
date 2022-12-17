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

export async function writeArticle(
  headline, text, about, isClosed, sectionId, 
  date = new Date().toISOString().slice(0, 19).replace('T', ' ')
) {
  const { data } = await $authHost.post(
    '/api/article/write',
    { headline, text, about, isClosed, sectionId, date }
  );
  data.date = new Date(data.date);
  return data;
}

export function editArticleText(id, text) {
  return $authHost.post( '/api/article/edit-text', { id, text });
}

export function deleteArticle(sectionId) {
   return $authHost.delete(
    '/api/article/' + sectionId
    );
}

export function addPicture(formData) {
  return $authHost.post('api/article/picture', formData);
}