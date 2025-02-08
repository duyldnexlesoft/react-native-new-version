import {get, post, put, del} from 'app/utils/baseApi';

export const getBookings = (query: any) => {
  return get('/api/userOrder/v1/getList', query);
};
export const createBank = (payload: any) => {
  return post('/api/userOrder/v1/cancel', payload);
};
export const updateBooking = (payload: any) => {
  return put('/api/userOrder/v1/update', payload);
};
export const cancelBooking = (payload: any) => {
  return post('/api/userOrder/v1/cancel', payload);
};


export default {}