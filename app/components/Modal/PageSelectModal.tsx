/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, ScrollView, Text, View} from 'react-native';
import _ from 'lodash';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import colors from 'app/utils/colors';
import {AnimatedCheckedIcon} from '../AnimatedIcon';
import {useTranslation} from 'react-i18next';
import GrayLayout from 'app/layout/GrayLayout';
import Modal from './Modal';
const LIMIT = 20;

const PageSelectModal = (props: any) => {
  const {setModal, itemSelect, modal, onSelect, title, items} = props;
  const {t} = useTranslation();
  const [selectItem, setSelectItem]: any = useState(itemSelect);
  const [loadMore, setLoadMore]: any = useState(false);
  const [showItems, setShowItems]: any = useState(_.take(items, LIMIT));

  const handleSelect = (value: string) => {
    onSelect && onSelect(value);
    setModal(!modal);
  };
  const renderRight = () => {
    return (
      <Pressable className="w-10 h-9 items-center justify-center" onPress={() => handleSelect(selectItem)}>
        <Text className="text-base font-medium text-gray-900">{t('done')}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    if (loadMore && _.size(items) !== _.size(showItems)) {
      const lm = _.size(showItems) * 0.3;
      setShowItems(_.take(items, _.size(showItems) + (lm < LIMIT ? LIMIT : lm)));
      setLoadMore(false);
    }
  }, [loadMore]);

  const handleScroll = ({nativeEvent}: any) => {
    const {contentSize, contentOffset, layoutMeasurement} = nativeEvent;
    if (!loadMore && layoutMeasurement.height + contentOffset.y > contentSize.height * 0.6) {
      setLoadMore(true);
    }
    if (loadMore && layoutMeasurement.height + contentOffset.y < contentSize.height * 0.6) {
      setLoadMore(false);
    }
  };

  return (
    <Modal animationType="fade" {...props}>
      <GrayLayout showLeft={false} {...props} renderRight={renderRight}>
        <SafeAreaView>
          <ScrollView
            className="mb-20"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={1}
            onScroll={handleScroll}>
            <View className="bg-white px-4 divide-y divide-border pt-2">
              {showItems?.map((item: any, index: any) => (
                <Pressable
                  key={`key-${title}-${index + 1}`}
                  className="bg-white h-12 flex-row items-center justify-between"
                  onPress={() => setSelectItem(item)}>
                  {item.render || <Text className="text-lg text-textContainer">{item.name}</Text>}
                  <Checked selectItem={selectItem} item={item} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </GrayLayout>
    </Modal>
  );
};

const Checked = ({selectItem, item}: any) => {
  const aBackgroundColor = useSharedValue(colors.backgroundHover);
  const aTextColor = useSharedValue(colors.gray400);

  const styleBackground = useAnimatedStyle(() => ({backgroundColor: aBackgroundColor.value}));
  const styleText = useAnimatedStyle(() => ({color: aTextColor.value}));

  useEffect(() => {
    aBackgroundColor.value = withTiming(selectItem?.id === item?.id ? colors.primary : colors.backgroundHover, {duration: 200});
    aTextColor.value = withTiming(selectItem?.id === item?.id ? colors.white : colors.gray400, {duration: 200});
  }, [selectItem]);

  return (
    <Animated.View className={'w-[30px] h-[30px] items-center justify-center rounded-full '} style={styleBackground}>
      <AnimatedCheckedIcon animatedProps={styleText} />
    </Animated.View>
  );
};

export default PageSelectModal;
