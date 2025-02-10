/* eslint-disable prettier/prettier */
import {get, post} from 'app/utils/baseApi';
// import {CLIENT_ID, PACKET_ID} from '@env';

export const render = () => {
  return get(`https://api.toughclicks.com/api/v1/client/${process.env.CLIENT_ID}/packet/${process.env.PACKET_ID}`);
};
export const createAcceptance = (payload: any) => {
  const body = {
    customData: {},
    applicationContext: {model: payload.model},
    packetId: process.env.PACKET_ID,
    displayMethod: 'group',
    signerIdentifier: payload.Email,
    documents: payload.documents,
    signerEmailAddress: '',
    dynamicData: null,
  };
  return post(`https://api.toughclicks.com/api/v1/client/${process.env.CLIENT_ID}/accept`, body);
};

export default {}