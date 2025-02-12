import SliderImage from 'app/components/SliderImage';
import React, {useState} from 'react';
import {View, SafeAreaView, StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';
import Header from 'app/components/Header';
import Animated, {runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import ColorLayout from 'app/layout/ColorLayout';
import {drop} from 'lodash';
const dimensions = Dimensions.get('screen');

const DetailLayout = (props: any) => {
  const statusBarHeight = Platform.OS === 'android' ? Number(StatusBar.currentHeight || 0) : 0;
  const {children, Images, onScroll} = props;
  const [top, setTop]: any = useState(statusBarHeight);
  const slideTransTop = useSharedValue(0);
  const headerTransTop = useSharedValue(0);
  const paddingTop = useSharedValue(10);
  const paddingLeft = useSharedValue(16);
  const fontSizeTitle = useSharedValue(24);
  const fontSizeDesc = useSharedValue(14);
  const title = useSharedValue(1);
  const scrollHandler = useAnimatedScrollHandler((event: any) => {
    let point = event.contentOffset.y - (250 - top - 48);
    point = point < 0 ? 0 : point > 48 ? 48 : point;

    title.value = 1 - (point / 48) * (1 - 0.8);
    fontSizeTitle.value = 24 - (point / 48) * (24 - 18);
    fontSizeDesc.value = 14 - (point / 48) * (14 - 12);
    paddingLeft.value = (point / 48) * (32 - 16) + 16;

    paddingTop.value = event.contentOffset.y <= 260 - top ? 10 : event.contentOffset.y - 260 + top + 10;
    paddingTop.value = paddingTop.value > top ? top : paddingTop.value;

    headerTransTop.value = event.contentOffset.y <= 250 ? 0 : event.contentOffset.y - 250;
    slideTransTop.value = event.contentOffset.y < 0 ? 0 : event.contentOffset.y;
    onScroll && runOnJS(onScroll)(event);
  });

  const styleTitle = useAnimatedStyle(() => ({transform: [{scaleY: title.value}, {scaleX: title.value}]}));
  const styleSliderTop = useAnimatedStyle(() => ({transform: [{translateY: slideTransTop.value}]}));
  const styleHeader = useAnimatedStyle(() => ({
    overflow: paddingTop.value === 10 ? 'hidden' : 'visible',
    elevation: paddingTop.value === 10 ? 0 : 3,
    paddingTop: paddingTop.value,
    paddingLeft: paddingLeft.value,
    transform: [{translateY: headerTransTop.value}],
  }));

  return (
    <ColorLayout className="bg-white !pt-0" {...props}>
      <Header {...props} absolute showLeft className="w-16" />
      <SafeAreaView className="absolute top-0" onLayout={event => setTop(statusBarHeight || event.nativeEvent.layout.height - 10)} />
      <Animated.ScrollView className="h-full" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} onScroll={scrollHandler}>
        <Animated.View className="absolute bg-backgroundHover" style={[styleSliderTop]}>
          <SliderImage height={300} Images={Images} />
        </Animated.View>
        <View className="pt-4 top-[250px] bg-white rounded-t-[20px] z-[2] pb-[270px]" style={{minHeight: dimensions.height - 250}}>
          <Animated.View
            className="px-4 w-full flex-row justify-between absolute bg-white rounded-t-[20px] items-center z-10"
            style={[styleHeader, styles.shadow]}>
            <Animated.View className="pb-2" style={[styleTitle]}>
              {children[0]}
            </Animated.View>
            {children[1]}
          </Animated.View>
          {children[2]}
        </View>
      </Animated.ScrollView>
      {drop(children, 3)}
    </ColorLayout>
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
  },
});
export default DetailLayout;
