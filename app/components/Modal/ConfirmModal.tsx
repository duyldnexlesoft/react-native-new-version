import React from 'react';
import {Pressable, View} from 'react-native';
import Text from '../Text';
import {useTranslation} from 'react-i18next';
import Modal from './Modal';

const ConfirmModal = (props: any) => {
  const {setModal, modal, title, note, showLeft = true, showRight = true, leftTitle, rightTitle, confirm} = props;
  const {t} = useTranslation();
  const handleConfirm = () => {
    setModal(false);
    if (confirm) confirm();
  };

  return (
    <Modal animationType="fade" {...props} className="items-center justify-center">
      <View className="w-[275px] bg-white rounded-[10px] items-center">
        <Text className="text-lg text-black font-bold mb-2 mt-6">{title}</Text>
        <Text className="text-base text-black text-center px-7">{note}</Text>
        <View className="w-full flex-row items-center border-t border-border mt-6 justify-center">
          {showLeft && (
            <Pressable className="items-center justify-center flex-1" onPress={() => setModal(!modal)}>
              <Text className="text-blue-500 text-base font-medium py-3">{leftTitle || t('cancel')}</Text>
            </Pressable>
          )}
          {showLeft && showRight && <View className="border-r border-border h-full w-[1px]" />}
          {showRight && (
            <Pressable className="items-center justify-center flex-1" onPress={handleConfirm}>
              <Text className="text-red-500 text-base font-medium py-3">{rightTitle || t('yes')}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
