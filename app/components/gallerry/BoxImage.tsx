/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View, Dimensions, Pressable} from 'react-native';
import CloseIcon from 'assets/svg/close.svg';
import AddIcon from 'assets/svg/add.svg';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Image from 'app/components/Image';
import {cloneDeep, filter, map, max} from 'lodash';
const dimensions = Dimensions.get('screen');
const GAP = 10;
const WIDH_DEFAULD = (dimensions.width - 32 - GAP * 2) / 3;

const BoxImage = ({image, boxImages, setBoxImages, handleChoosePhoto, onChange, ratio}: any) => {
  const {size, url, index, pointX, pointY} = image;
  const width = WIDH_DEFAULD * size + (size - 1) * GAP;
  const height = WIDH_DEFAULD * ratio * size + (size - 1) * GAP;
  const aTransX = useSharedValue(pointX);
  const aTransY = useSharedValue(pointY);
  const adWidth = useSharedValue(width);
  const aHeight = useSharedValue(height);
  const aZindex = useSharedValue(1);

  const styleTrans = useAnimatedStyle(() => ({
    // transform: [{translateX: aTransX.value}, {translateY: aTransY.value}],
    width: adWidth.value,
    height: aHeight.value,
    zIndex: aZindex.value,
  }));

  useEffect(() => {
    aTransX.value = withTiming(pointX, {duration: 200});
    aTransY.value = withTiming(pointY, {duration: 200});
  }, [pointX, pointY]);

  useEffect(() => {
    adWidth.value = withTiming(width, {duration: 200});
    aHeight.value = withTiming(height, {duration: 200});
  }, [width]);

  const handleTouchEnd = () => {
    const newBoxImages = cloneDeep(boxImages);
    let imagecheck: any;
    boxImages.forEach((img: any) => {
      const pt = width * img.size * (img.size === 1 ? 0.35 : 0.6);
      if (Math.abs(aTransX.value - img.pointX) < pt && Math.abs(aTransY.value - img.pointY) < pt * ratio && index !== img.index && !!img.url) {
        imagecheck = img;
      }
    });

    if (imagecheck) {
      newBoxImages.forEach((boxImage: any) => {
        if (boxImage.url === url) {
          boxImage.index = imagecheck.index;
          boxImage.pointX = imagecheck.pointX;
          boxImage.pointY = imagecheck.pointY;
          boxImage.size = imagecheck.size;
        } else if (boxImage.url === imagecheck.url) {
          boxImage.index = index;
          boxImage.pointX = pointX;
          boxImage.pointY = pointY;
          boxImage.size = size;
        }
      });
      setBoxImages(newBoxImages);
      onChange && onChange({changeIndex: [index, imagecheck.index]});
      aZindex.value = 1;
    } else {
      adWidth.value = withTiming(width, {duration: 100});
      aHeight.value = withTiming(height, {duration: 100});
      aTransX.value = withTiming(pointX, {duration: 100});
      aTransY.value = withTiming(pointY, {duration: 100});
      aZindex.value = 1;
    }
  };

  const handleDeleteImage = () => {
    let newBoxImages = cloneDeep(boxImages);
    let indexMaxImage = max(map(filter(newBoxImages, 'url'), 'index'));
    for (let i = 0; i < newBoxImages.length; i++) {
      const boxImage = newBoxImages[i];
      if (boxImage.index === index && boxImage.url) {
        boxImage.url = null;
        boxImage.size = 0;
      }
    }
    for (let i = 0; i < newBoxImages.length; i++) {
      const boxImage = newBoxImages[i];
      if (boxImage.index > index && boxImage.url) {
        const indexsPer = boxImages.find((img: any) => img.index === boxImage.index - 1 && img.url && img.size !== 0);
        boxImage.index = indexsPer.index;
        boxImage.pointX = indexsPer.pointX;
        boxImage.pointY = indexsPer.pointY;
        boxImage.size = indexsPer.size;
      }
    }
    if (newBoxImages.filter((img: any) => img.size !== 0).length < 7) {
      const indexsPer = boxImages.find((img: any) => img.index === indexMaxImage && img.url && img.size !== 0);
      newBoxImages.push({index: indexMaxImage, url: null, pointX: indexsPer.pointX, pointY: indexsPer.pointY, size: indexsPer.size});
    }
    indexMaxImage = max(map(filter(newBoxImages, 'url'), 'index'));
    newBoxImages = newBoxImages.filter((img: any) => img.index <= (indexMaxImage > 5 ? indexMaxImage : 5));
    setBoxImages(newBoxImages);
    onChange && onChange({delIndex: index});
  };

  const gesturePan = Gesture.Pan()
    .onChange(event => {
      if (aZindex.value === 2) {
        aTransX.value = aTransX.value + event.changeX;
        aTransY.value = aTransY.value + event.changeY;
      }
    })
    .onFinalize(event => {
      if (aZindex.value === 2) {
        runOnJS(handleTouchEnd)();
      }
    })
    .onBegin(event => {
      if (event.x < width - 30 && event.y < width - 30) {
        adWidth.value = withTiming(WIDH_DEFAULD, {duration: 100});
        aHeight.value = withTiming(WIDH_DEFAULD * ratio, {duration: 100});
        aTransX.value = withTiming(image.pointX + event.x - WIDH_DEFAULD / 2, {duration: 100});
        aTransY.value = withTiming(image.pointY + event.y - WIDH_DEFAULD / 2, {duration: 100});
        aZindex.value = 2;
      }
    });

  if (size === 0) {
    return null;
  }

  if (!url) {
    return (
      <Pressable
        onPress={handleChoosePhoto}
        className="bg-bgLightGray absolute rounded-[10px] items-center justify-center"
        style={{width, height, transform: [{translateX: pointX}, {translateY: pointY}]}}>
        <View className="w-6 h-6 rounded-full items-center justify-center bg-white absolute right-1 bottom-1 border border-border">
          <AddIcon className="text-secondary" width={14} height={14} />
        </View>
      </Pressable>
    );
  }

  return (
    <GestureDetector gesture={gesturePan}>
      <Animated.View style={[styleTrans]} className="bg-backgroundHover rounded-[10px] absolute items-center justify-center">
        <View className="rounded-[10px] overflow-hidden w-full h-full">
          <Image className="w-full h-full" uri={url} />
        </View>
        <Pressable
          className="w-6 h-6 rounded-full items-center justify-center bg-white absolute right-1 bottom-1 border border-border"
          onPress={handleDeleteImage}>
          <CloseIcon className="text-gray-500" width={14} height={14} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export default BoxImage;
