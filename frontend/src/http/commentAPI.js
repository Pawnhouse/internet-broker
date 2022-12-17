import { $authHost } from '.';


export async function getComments() {
  const { data } = await $authHost.get('/api/comment/');
  data.forEach((comment) => {
    comment.date = new Date(comment.date);
  });
  return data;
}

export async function createComment(text, sectionId) {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const { data } = await $authHost.post(
    '/api/comment/create',
    { text, date, sectionId }
  );
  data.date = new Date(data.date);
  return data;
}

export async function editComment(id, text) {
  await $authHost.post(
    '/api/comment/edit',
    { id, text }
  );
}

export async function deleteComment(id) {
  await $authHost.delete('/api/comment/' + id);
}
