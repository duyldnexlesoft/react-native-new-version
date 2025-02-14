import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Text';
import colors from 'app/utils/colors';
import {filter} from 'lodash';
import { remapProps } from 'nativewind';
import tw from "twrnc";

export interface ButtonProps {
  style?: any;
  children?: React.ReactNode;
  onPress?: any;
  disabled?: any;
  className?: any;
}

const ButtonGreen = (props: ButtonProps) => {
  const styleText = filter(props?.style, (elm: any) => elm.fontSize || elm.fontWeight || elm.color || elm.textTransform);
  const config = {start: {x: 0, y: 0}, end: {x: 1, y: 1}, colors: [colors.secondary, colors.primary]};
  return (
    <View className="w-full bg-white rounded-[10px]">
      <LinearGradient {...config} style={tw`w-full rounded-[10px] active:opacity-80 overflow-hidden ${props.disabled ? 'opacity-60' : ''}`}>
        <TouchableOpacity accessibilityRole="button" className="w-full h-12 items-center justify-center" {...props}>
          <Text className="text-center text-white text-base font-medium" style={styleText}>
            {props.children}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
remapProps(ButtonGreen, { className: "style" });
export default ButtonGreen;
