import {post, put, get, del} from 'app/utils/baseApi';
import { omit } from 'lodash';

export const login = (payload: any) => {
  return post('/api/common/v1/login', payload);
};
export const signup = (payload: any) => {
  return post('/api/user/v1/signup', payload);
};
export const deleteUser = () => {
  return del('/api/verifiedUser/v1/deleteUser');
};
export const getProfile = (_id: any) => {
  return get('/api/verifiedUser/v1/getDetails/' + _id);
};
export const updateProfile = (payload: any) => {
  return put('/api/verifiedUser/v1/update', payload);
};
export const changePassword = (payload: any) => {
  return put('/api/user/v1/changePassword', payload);
};
export const uploadImage = (payload: any) => {
  return put('/api/verifiedUser/v1/updateImage', payload, {'Content-Type': 'multipart/form-data;'});
};
export const deleteImage = (payload: any) => {
  return put('/api/verifiedUser/v1/deleteImage', payload);
};
export const changeImageIndex = (payload: any) => {
  return put('/api/verifiedUser/v1/changeImageIndex', payload);
};
export const generatePasswordCode = (payload: any) => {
  return put('/api/user/v1/generatePasswordCode', payload);
};
export const checkPasswordCode = (payload: any) => {
  return post('/api/user/v1/checkPasswordCode', payload);
};
export const resetPassword = (payload: any) => {
  return put('/api/user/v1/resetPassword?token=' + payload.token, omit(payload, 'token'));
};
export const resendVerifyAccountLink = (email: any) => {``
  return get('/api/common/v1/resendVerifyAccountLink?email=' + encodeURIComponent(email));
};

export default {}