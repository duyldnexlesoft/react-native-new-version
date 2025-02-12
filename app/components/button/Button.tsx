import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from '../Text';

const Button = (props: any) => {
  const styleText = props.style.filter((elm: any) => elm.fontSize || elm.fontWeight || elm.color || elm.textTransform);
  return (
    <TouchableOpacity className="bg-border rounded-md h-12 px-4 justify-center" {...props}>
      <Text className="text-gray-900 font-medium" style={styleText}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
