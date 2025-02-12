import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import Modal from './Modal';

const AlertSelectModal = (props: any) => {
  const {setModal, modal, onSelect, title, items} = props;
  const {t} = useTranslation();
  const handleSelect = (value: string) => {
    onSelect && onSelect(value);
    setModal(!modal);
  };

  return (
    <Modal animationType="slide" {...props}>
      <SafeAreaView className="absolute bottom-4 w-full z-10">
        <View className="px-4">
          <View className="bg-white rounded-[10px] overflow-hidden items-center">
            <View className="w-16 h-2 bg-[#F9F5F5] mb-1.5 mt-4 rounded-full" />
            <View className="divide-y divide-border w-full">
              <View className="bg-white h-12 items-center justify-center">
                <Text className="text-center text-lg font-medium text-textContainer">
                  {t('select')} {title}
                </Text>
              </View>
              {items.map((item: string, index: any) => (
                <Pressable key={`key-${title}-${index + 1}`} className="bg-white h-12 items-center justify-center" onPress={() => handleSelect(item)}>
                  <Text className="text-center text-lg text-secondary">{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Pressable className="bg-white rounded-[10px] h-12 mt-3 items-center justify-center" onPress={() => setModal(!modal)}>
            <Text className="text-lg font-bold text-textContainer">{t('cancel')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AlertSelectModal;
