import React from 'react';
import {Alert, Pressable, View} from 'react-native';
import Text from '../Text';
import SignupSuccessSvg from 'assets/svg/signup-success.svg';
import ButtonGreen from '../button/ButtonGreen';
// import ROUTER from 'app/navigation/router';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {resendVerifyAccountLink} from 'app/api/userApi';
import Modal from './Modal';

const SignupSuccessModal = (props: any) => {
  const {navigation, userCreate} = props;
  const {t} = useTranslation();
  const muResendVerifyAccountLink = useMutation('resendVerifyAccountLink', {
    mutationFn: resendVerifyAccountLink,
    onSuccess: (response: any) => {
      Alert.alert(response?.data?.message);
    },
    onError: () => {},
  });

  return (
    <Modal animationType="fade" {...props} className="items-center justify-center">
      <View className="w-full">
        <View className="bg-white rounded-[10px] items-center mx-8">
          <View className="p-8 items-center">
            <SignupSuccessSvg />
            <Text className="text-lg text-black font-bold mb-2 mt-4">{t('SignupSuccessModalTitle')}</Text>
            <Text className="text-base text-black text-center mb-2">
              {t('SignupSuccessModalDescription1')} <Text className="text-secondary font-medium">{userCreate.Email}</Text>
            </Text>
            <Text className="text-base text-black text-center mb-3">{t('SignupSuccessModalDescription2')}</Text>
            <Text className="text-base text-darkBrown text-center">{t('SignupSuccessModalDescription3')}</Text>
            <View className="mt-6 mb-4">
              <ButtonGreen className="px-8 uppercase" onPress={() => muResendVerifyAccountLink.mutate(userCreate.Email)}>
                {t('resendEmail')}
              </ButtonGreen>
            </View>
            <View className="flex-row items-center">
              <Text className="text-base text-black">{t('SignupSuccessModalDescription4')}</Text>
              {/* <Pressable onPress={() => navigation.navigate(ROUTER.SIGN_IN)}>
                <Text className="text-base text-secondary pl-1 font-bold">{t('login')}</Text>
              </Pressable> */}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SignupSuccessModal;
