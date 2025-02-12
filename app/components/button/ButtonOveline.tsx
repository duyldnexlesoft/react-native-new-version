import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Text';
import colors from 'app/utils/colors';
import {filter} from 'lodash';

export interface ButtonProps {
  style?: any;
  children?: React.ReactNode;
  onPress?: any;
  disabled?: any;
  className?: any;
}

const ButtonOveline = (props: ButtonProps) => {
  const styleText = filter(props?.style, (elm: any) => elm.fontSize || elm.fontWeight || elm.color || elm.textTransform);
  return (
    <View className={`w-full rounded-[10px] overflow-hidden border border-secondary ${props.disabled ? 'opacity-60' : ''}`}>
      <TouchableOpacity accessibilityRole="button" className='w-full h-[46px] active:opacity-80 items-center justify-center' {...props}>
        <Text className="text-center text-secondary text-base font-medium" style={styleText}>
          {props.children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonOveline;
