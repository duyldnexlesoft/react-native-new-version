/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, TextInput as TextInputReact, Pressable, TextInputProps } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Controller } from 'react-hook-form';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export interface InputProps extends TextInputProps {
  name?: any;
  disabled?: any;
  label?: any;
  control?: any;
  right?: any;
  error?: any;
  mask?: any;
  rules?: any;
  leftIcon?: any;
  leftAction?: any;
  rightIcon?: any;
  rightAction?: any;
  height?: any;
  onPress?: any;
  comRef?: any;
  keyboardType?: any;
}

const TOP_NOACTIVE = -24;
const TOP_ACTIVE = 0;
const FONT_NOACTIVE = 14;
const FONT_ACTIVE = 12;
const PADDING_LEFT = 10;
const DURATION = 200;

const Input = (props: InputProps) => (props.mask ? <TextInputReact {...props} ref={props.comRef} /> : <MaskInput {...props} ref={props.comRef} />);

const InputComponent = (props: any) => {
  const field = props.field;
  const [lableInput, setLableInput] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [widthLeftIcon, setWidthLeftIcon] = useState(PADDING_LEFT);
  const top = useSharedValue(0);
  const font = useSharedValue(0);
  const left = useSharedValue(0);
  const styleTop = useAnimatedStyle(() => ({
    transform: [{ translateY: top.value }],
    marginLeft: left.value,
    fontSize: font.value,
  }));

  useEffect(() => {
    const checkFocus = !!field?.value || !!props?.value || focusInput;
    handleSetStyle(checkFocus, 0);
  }, []);

  useEffect(() => {
    left.value = lableInput ? PADDING_LEFT : widthLeftIcon;
  }, [widthLeftIcon]);

  useEffect(() => {
    handleSetStyle(lableInput, DURATION);
  }, [lableInput]);

  useEffect(() => {
    setLableInput(!!field?.value || !!props?.value || focusInput);
  }, [field?.value, props?.value]);

  const handleSetStyle = (checkActive: boolean, duration: number) => {
    top.value = withTiming(checkActive ? TOP_NOACTIVE : TOP_ACTIVE, { duration });
    font.value = withTiming(checkActive ? FONT_ACTIVE : FONT_NOACTIVE, { duration });
    left.value = withTiming(checkActive ? PADDING_LEFT : widthLeftIcon, { duration });
  };

  const handleOnFocus = () => {
    setLableInput(true);
    setFocusInput(true);
  };
  const handleOnEndEditing = (event: any) => {
    setLableInput(!!event.nativeEvent.text);
    setFocusInput(false);
  };
  const cssBorder = () => {
    if (props.error) {
      return 'border-orange-600';
    } else if (focusInput) {
      return 'border-secondary';
    } else {
      return 'border-lightGray';
    }
  };
  return (
    <View
      className={'bg-bgScreen w-full border rounded-md flex-row items-center justify-between ' + cssBorder()}
      style={{ height: props.height || 50 }}
    >
      {props.onPress && <Pressable className="absolute w-full h-12 z-20" onPress={props.onPress} />}
      {props.leftIcon && (
        <Pressable
          onLayout={event => setWidthLeftIcon((event.nativeEvent.layout.width || 0) + PADDING_LEFT)}
          className={`p-2 h-12 flex justify-center items-center ${props.leftAction ? 'z-30' : ''}`}
          onPress={props.leftAction}
        >
          {props.leftIcon}
        </Pressable>
      )}
      {props.label && (
        <Animated.Text className={`absolute top-4 rounded-md bg-bgScreen text-gray-500 px-2`} style={[styleTop, { fontFamily: 'Ubuntu' }]}>
          {props.label}
        </Animated.Text>
      )}
      <Input
        className="flex-1 pl-3 h-[90%] text-textContainer"
        onEndEditing={handleOnEndEditing}
        onFocus={handleOnFocus}
        onBlur={field?.onBlur || props?.onBlur}
        onChangeText={field?.onChange || props?.onChange}
        value={field?.value}
        editable={!props.onPress}
        autoCapitalize="none"
        textAlignVertical={props?.multiline ? 'top' : 'center'}
        autoCorrect={false}
        {...props}
        style={[{ fontFamily: 'Ubuntu' }, props.style]}
      />
      {props.rightIcon && (
        <Pressable className={`p-2 h-12 flex justify-center items-center ${props.rightAction ? 'z-30' : ''}`} onPress={props.rightAction}>
          {props.rightIcon}
        </Pressable>
      )}
    </View>
  );
};

const TextInput = (props: InputProps) => {
  return props.control ? (
    <Controller control={props.control} rules={props.rules} render={({ field }) => <InputComponent field={field} {...props} />} name={props.name} />
  ) : (
    <InputComponent {...props} />
  );
};

export default TextInput;
