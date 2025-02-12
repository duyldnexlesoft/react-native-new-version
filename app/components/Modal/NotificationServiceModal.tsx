import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '../Text';
import ButtonGreen from '../button/ButtonGreen';
// import ROUTER from 'app/navigation/router';
import {useTranslation} from 'react-i18next';
import Modal from './Modal';

const NotificationServiceModal = (props: any) => {
  const {navigation, setModal} = props;
  const {t} = useTranslation();
  return (
    <Modal animationType="fade" {...props} className="items-center justify-center">
      <View className="w-[315px] bg-white rounded-[10px] items-center">
        <Text className="text-lg text-black font-bold mb-2 mt-6">{t('notiTitle')}</Text>
        <Text className="text-base text-black text-center px-7">{t('notiNote')}</Text>
        <View className='pt-4'>
          {/* <ButtonGreen className="px-8 uppercase" onPress={() => navigation.navigate(ROUTER.PROFILE)}>
            {t('goProfile')}
          </ButtonGreen> */}
        </View>
        <TouchableOpacity className="py-4 mb-2" onPress={() => setModal(false)}>
          <Text>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default NotificationServiceModal;
