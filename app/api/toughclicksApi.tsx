/* eslint-disable prettier/prettier */
import {get, post} from 'app/utils/baseApi';
// import {CLIENT_ID, PACKET_ID} from '@env';

export const render = () => {
  return get(`https://api.toughclicks.com/api/v1/client/${process.env.EXPO_PUBLIC_CLIENT_ID}/packet/${process.env.EXPO_PUBLIC_PACKET_ID}`);
};
export const createAcceptance = (payload: any) => {
  const body = {
    customData: {},
    applicationContext: {model: payload.model},
    packetId: process.env.EXPO_PUBLIC_PACKET_ID,
    displayMethod: 'group',
    signerIdentifier: payload.Email,
    documents: payload.documents,
    signerEmailAddress: '',
    dynamicData: null,
  };
  return post(`https://api.toughclicks.com/api/v1/client/${process.env.EXPO_PUBLIC_CLIENT_ID}/accept`, body);
};

export default {}