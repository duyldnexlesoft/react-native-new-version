import React from 'react';
import {Pressable} from 'react-native';
import CheckedIcon from 'assets/svg/checked.svg';
import {find, get} from 'lodash';

const CheckBox = ({status, onPress, style}: any) => {
  const width = get(find(style, 'width'), 'width') || 30;
  const height = get(find(style, 'height'), 'height') || 30;
  const cssStatus = status ? 'bg-secondary' : 'bg-backgroundHover';
  return (
    <Pressable className={`rounded-sm flex items-center justify-center ${cssStatus}`} onPress={onPress} style={{width, height}}>
      <CheckedIcon width={width * 0.65} height={height} className={`${status ? 'text-white' : 'text-gray-400'}`} />
    </Pressable>
  );
};

export default CheckBox;
