import React from 'react';
import {StatusBar, View, Platform} from 'react-native';
import LoadingScreenModal from 'app/components/Modal/LoadingScreenModal';
import Header from 'app/components/Header';

const GrayLayout = (props: any) => {
  const {isLoading, children, light, style} = props;
  const statusBarHeight = Platform.OS === 'android' ? Number(StatusBar.currentHeight || 0) + 5 : 0;
  return (
    <View className="h-full w-full bg-bgScreen" style={[style]}>
      <LoadingScreenModal isLoading={isLoading} />
      {Platform.OS !== 'ios' && <StatusBar animated={true} backgroundColor={'transparent'} barStyle={!light ? 'dark-content' : 'light-content'} />}
      <Header showHeaderTitle showLeft showBackground style={[{paddingTop: statusBarHeight}]} {...props} />
      {children}
    </View>
  );
};
export default GrayLayout;
