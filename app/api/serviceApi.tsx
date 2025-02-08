import {get, put, post, del} from 'app/utils/baseApi';

export const getService = (query: any) => {
  return get('/api/service/v1/getList', query);
};

export const createService = (payload: any) => {
  return post('/api/service/v1/create', payload, {'Content-Type': 'multipart/form-data;'});
};

export const updateService = (payload: any) => {
  return put('/api/service/v1/update', payload, {'Content-Type': 'multipart/form-data;'});
};

export const deleteService = (id: any) => {
  return del('/api/service/v1/delete/' + id);
};

export default {};