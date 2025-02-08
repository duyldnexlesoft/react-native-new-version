import {get, put} from 'app/utils/baseApi';

export const getAvailability = () => {
  return get('/api/availability/v1/get');
};

export const saveAvailability = (payload: any) => {
  return put('/api/availability/v1/save', payload);
};

export default {}