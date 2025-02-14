import ButtonGreen from 'app/components/button/ButtonGreen';
import TextInput from 'app/components/TextInput';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Dimensions, SafeAreaView, ScrollView, View} from 'react-native';
import EyeIcon from 'assets/svg/eye.svg';
import EyeOffIcon from 'assets/svg/eye-slash.svg';
import {changePassword} from 'app/api/userApi';
import {useMutation} from 'react-query';
import BgSignin from 'assets/svg/bg-signin.svg';
import GrayLayout from 'app/layout/GrayLayout';
import Alert from 'app/components/Alert';
import { router } from 'expo-router';
import { PROFILE_MENU } from 'app/utils/router';
// import ROUTER from 'app/navigation/router';
const dimensions = Dimensions.get('screen');

const ChangePassword = (props: any) => {
  const {t} = useTranslation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const muChangePassword = useMutation('changePassword', {
    mutationFn: changePassword,
    onSuccess: (response: any) => {
      if (response?.data?.code === 200) {
        router.navigate(PROFILE_MENU);
        Alert.alert(t('changePasswordSuccessful'));
      } else {
        Alert.alert(response?.data?.message);
      }
    },
    onError: () => {},
  });
  const {control, handleSubmit} = useForm();
  const onSubmit = (data: any) => muChangePassword.mutate(data);

  return (
    <GrayLayout isLoading={muChangePassword.isLoading} {...props}>
      <View className="absolute bottom-[-1px] w-full">
        <BgSignin width={dimensions.width} height={(42 * dimensions.width) / 375} />
      </View>
      <SafeAreaView className="h-full w-full">
        <ScrollView>
          <View className="items-center justify-center p-8">
            <View className="mt-1 w-full">
              <TextInput
                label={t('oldPassword')}
                name="OldPassword"
                secureTextEntry={!showOldPassword}
                control={control}
                rightIcon={showOldPassword ? <EyeOffIcon className="text-secondary" /> : <EyeIcon className="text-secondary" />}
                rightAction={() => setShowOldPassword(!showOldPassword)}
              />
            </View>
            <View className="mt-4 w-full">
              <TextInput
                label={t('newPassword')}
                name="NewPassword"
                secureTextEntry={!showNewPassword}
                control={control}
                rightIcon={showNewPassword ? <EyeOffIcon className="text-secondary" /> : <EyeIcon className="text-secondary" />}
                rightAction={() => setShowNewPassword(!showNewPassword)}
              />
            </View>
            <View className="mt-4 w-full">
              <TextInput
                label={t('confirmNewPassword')}
                name="ConfirmPassword"
                secureTextEntry={!showPasswordConfirm}
                control={control}
                rightIcon={showPasswordConfirm ? <EyeOffIcon className="text-secondary" /> : <EyeIcon className="text-secondary" />}
                rightAction={() => setShowPasswordConfirm(!showPasswordConfirm)}
              />
            </View>
            <View className="mt-8 w-full">
              <ButtonGreen className="uppercase" onPress={handleSubmit(onSubmit)}>
                {t('changePassword')}
              </ButtonGreen>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GrayLayout>
  );
};

export default ChangePassword;
