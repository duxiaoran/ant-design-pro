import request from '@/utils/request';

const baseUrl = 'localhost:1999';

export async function getData(params, url) {
  return request(url, {
    method: 'GET',
    queryParams: params,
  });
}

export async function findOne(id, url) {
  return request(`${url}/${id}`, {
    method: 'GET',
  });
}

export async function getDataCount(params, url) {
  return request(`${url}/count`, {
    method: 'GET',
    queryParams: params,
  });
}

export async function addData(params, url) {
  return request(url, {
    method: 'POST',
    body: params,
  });
}

export async function updateData(params, url) {
  let id;
  if (params instanceof FormData) {
    id = params.get('id');
  } else {
    ({ id } = params);
  }
  const lastUrl = `${url}/${id}`;
  return request(lastUrl, {
    method: 'PUT',
    body: params,
  });
}

export async function delData(id, url) {
  return request(`${url}/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadfile(params, url) {
  return request(`${url}/upload`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteMany(params, url) {
  const lastUrl = `${url}/deleteMany`;
  return request(lastUrl, {
    method: 'POST',
    body: params,
  });
}

export async function updateMany(params, url) {
  const lastUrl = `${url}/updateMany`;
  return request(lastUrl, {
    method: 'POST',
    body: params,
  });
}

export async function updateEach(params, url) {
  const lastUrl = `${url}/updateEach`;
  return request(lastUrl, {
    method: 'POST',
    body: params,
  });
}
