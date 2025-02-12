/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TextInput as TextInputReact, Pressable, TextInputProps} from 'react-native';
// import TextInputMask from 'react-native-text-input-mask';
import {Controller} from 'react-hook-form';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

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

const InputComponent = (props: any) => {
  const field = props.field;
  const [lableInput, setLableInput] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [widthLeftIcon, setWidthLeftIcon] = useState(PADDING_LEFT);
  const top = useSharedValue(field?.value ? TOP_NOACTIVE : TOP_ACTIVE);
  const font = useSharedValue(field?.value ? FONT_ACTIVE : FONT_NOACTIVE);
  const left = useSharedValue(widthLeftIcon);
  const styleTop = useAnimatedStyle(() => ({
    transform: [{translateY: top.value}],
    marginLeft: left.value,
    fontSize: font.value,
  }));

  useEffect(() => {
    left.value = lableInput ? PADDING_LEFT : widthLeftIcon;
  }, [widthLeftIcon]);

  useEffect(() => {
    top.value = withTiming(lableInput ? TOP_NOACTIVE : TOP_ACTIVE, {duration: DURATION});
    font.value = withTiming(lableInput ? FONT_ACTIVE : FONT_NOACTIVE, {duration: DURATION});
    left.value = withTiming(lableInput ? PADDING_LEFT : widthLeftIcon, {duration: DURATION});
  }, [lableInput]);

  useEffect(() => {
    setLableInput(!!field?.value || focusInput);
  }, [field?.value]);

  useEffect(() => {
    if (!field) {
      setLableInput(!!props?.value || focusInput);
    }
  }, [props?.value]);

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
    <View className={'bg-bgScreen w-full border rounded-md flex-row items-center justify-between ' + cssBorder()} style={{height: props.height || 50}}>
      {props.onPress && <Pressable className="absolute w-full h-12 z-20" onPress={props.onPress} />}
      {props.leftIcon && (
        <Pressable
          onLayout={event => setWidthLeftIcon((event.nativeEvent.layout.width || 0) + PADDING_LEFT)}
          className={`p-2 h-12 flex justify-center items-center ${props.leftAction ? 'z-30' : ''}`}
          onPress={props.leftAction}>
          {props.leftIcon}
        </Pressable>
      )}
      {props.label && (
        <Animated.Text
          className={`absolute top-4 rounded-md bg-bgScreen text-gray-500 px-2 ${!!field?.value || focusInput ? 'z-10' : ''}`}
          style={[styleTop, {fontFamily: 'Ubuntu'}]}>
          {props.label}
        </Animated.Text>
      )}
      {(
        <TextInputReact
          className="flex-1 pl-3 h-[90%] text-textContainer"
          onEndEditing={handleOnEndEditing}
          onFocus={handleOnFocus}
          onBlur={field?.onBlur || props?.onBlur}
          onChangeText={field?.onChange || props?.onBlur}
          value={field?.value}
          editable={!props.onPress}
          autoCapitalize="none"
          textAlignVertical={props?.multiline ? "top" : "center"}
          autoCorrect={false}
          ref={props.comRef}
          {...props}
          style={[{fontFamily: 'Ubuntu'}, props.style]}
        />
      )}
      {/* {props.mask && (
        <TextInputMask
          className="flex-1 pl-3 h-[90%] text-textContainer"
          onEndEditing={handleOnEndEditing}
          onFocus={handleOnFocus}
          onBlur={field?.onBlur || props?.onBlur}
          onChangeText={field?.onChange || props?.onBlur}
          value={field?.value}
          editable={!props.onPress}
          autoCapitalize="none"
          textAlignVertical={props?.multiline ? "top" : "center"}
          autoCorrect={false}
          ref={props.comRef}
          {...props}
          style={[{fontFamily: 'Ubuntu'}, props.style]}
        />
      )} */}
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
    <Controller control={props.control} rules={props.rules} render={({field}) => <InputComponent {...{field}} {...props} />} name={props.name} />
  ) : (
    <InputComponent {...props} />
  );
};

export default TextInput;
