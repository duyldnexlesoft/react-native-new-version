import {get, post, del} from 'app/utils/baseApi';

export const getListBank = () => {
  return get('/api/bank/v1/getList');
};
export const createBank = (payload: any) => {
  return post('/api/bank/v1/create', payload);
};
export const createBankStripe = () => {
  return post('/api/bank/v1/createBankStripe');
};
export const sherpaOnboard = () => {
  return post('/api/bank/v1/SherpaOnboard?type=mobile');
};
export const deleteBank = () => {
  return del('/api/bank/v1/delete');
};
export default {}