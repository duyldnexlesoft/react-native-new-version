import React from 'react';
import {Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import ArrowLeft from 'assets/svg/arrow-left.svg';
import Text from './Text';

const Header = (props: any) => {
  const {navigation, leftAction, renderLeft, route, showHeaderTitle, showLeft, renderRight, title, style, absolute} = props;
  const statusBarHeight = Platform.OS === 'android' && absolute ? Number(StatusBar.currentHeight || 0) + 10 : 0;
  const styleText = style?.filter((elm: any) => elm.fontSize || elm.fontWeight || elm.color || elm.textTransform);
  const absoluteCss = props.absolute ? 'absolute' : '';
  const bgCss = props.showBackground ? 'bg-bgLightGray' : '';
  return (
    <SafeAreaView className={` ${absoluteCss} ${bgCss} z-[1] w-full`} style={[style, props.showBackground ? styles.shadow : {}]}>
      <View className="px-2 flex-row justify-between items-center pb-1" style={{paddingTop: statusBarHeight}}>
        {renderLeft ? (
          renderLeft()
        ) : showLeft ? (
          <TouchableOpacity
            className="w-9 h-9 items-center justify-center bg-white/30 rounded-full"
            onPress={() => (leftAction ? leftAction() : navigation?.dispatch(CommonActions.goBack()))}>
            <ArrowLeft width={16} height={18} className="text-textContainer" />
          </TouchableOpacity>
        ) : (
          <View className="w-9 h-9" />
        )}
        {showHeaderTitle && (
          <Text className="text-lg font-medium uppercase" style={styleText}>
            {title || route?.name}
          </Text>
        )}
        {renderRight ? renderRight() : <View className="w-9 h-9" />}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.3,
    elevation: 3,
  },
});
export default Header;
