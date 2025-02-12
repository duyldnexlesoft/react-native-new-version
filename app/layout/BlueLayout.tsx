import React from 'react';
import {StatusBar, View, Platform, Dimensions} from 'react-native';
import LoadingScreenModal from 'app/components/Modal/LoadingScreenModal';
import Header from 'app/components/Header';
import BgHeader from 'assets/svg/bgHeader.svg';
const dimensions = Dimensions.get('screen');

const BlueLayout = (props: any) => {
  const {isLoading, children, light, style} = props;
  const statusBarHeight = Platform.OS === 'android' ? Number(StatusBar.currentHeight || 0) + 5 : 0;
  return (
    <View className="h-full w-full bg-bgScreen" style={[style]}>
      <LoadingScreenModal isLoading={isLoading} />
      {Platform.OS !== 'ios' && <StatusBar animated={true} backgroundColor={'transparent'} barStyle={!light ? 'dark-content' : 'light-content'} />}
      <View className="overflow-hidden" style={[{paddingTop: statusBarHeight}]}>
        <View className="absolute w-full top-[-1px]">
          <BgHeader width={dimensions.width} height={(195 * dimensions.width) / 375} />
        </View>
        <Header showHeaderTitle className="text-white" {...props} />
      </View>
      {children}
    </View>
  );
};
export default BlueLayout;
