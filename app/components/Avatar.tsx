import React from 'react';
import {View} from 'react-native';
import UserGraySvg from 'assets/svg/userGray.svg';
import User30Svg from 'assets/svg/user30.svg';
import Image from './Image';
import {find, get} from 'lodash';

const Avatar = (props: any) => {
  const width = get(find(props?.style, 'width'), 'width') || 36;
  const height = get(find(props?.style, 'height'), 'height') || 36;
  return props.type === 'rounded' ? (
    <View className="rounded-full bg-brown items-center justify-center" style={[props.style, {width, height}]}>
      {props.image && <Image className="w-full h-full rounded-full" uri={props.image} />}
      {!props.image && <User30Svg className="text-gray-500" width={width * 0.45} height={height * 0.45} />}
    </View>
  ) : (
    <View className="rounded-full bg-tabDefault items-center justify-center" style={[props.style, {width, height}]}>
      {props.image && <Image className="w-full h-full rounded-full" uri={props.image} />}
      {!props.image && <UserGraySvg className="text-gray-500" width={width * 0.45} height={height * 0.45} />}
    </View>
  );
};
export default Avatar;
