import React, {useRef, useState} from 'react';
import {View, ScrollView, TouchableOpacity, Pressable, SafeAreaView} from 'react-native';
import {useForm} from 'react-hook-form';
import {useMutation, useQueryClient} from 'react-query';
import {login} from 'app/api/userApi';
import {userAction} from 'app/store/actions';
import {useDispatch} from 'react-redux';
import TextInput from 'app/components/TextInput';
import ButtonGreen from 'app/components/button/ButtonGreen';
import LogoSvg from 'assets/svg/logo.svg';
import EmailIcon from 'assets/svg/email.svg';
import EyeIcon from 'assets/svg/eye.svg';
import EyeOffIcon from 'assets/svg/eye-slash.svg';
import {useTranslation} from 'react-i18next';
import BasicLayout from 'app/layout/BasicLayout';
import Text from 'app/components/Text';
import Alert from 'app/components/Alert';
import { FORGOT_PASSWORD, SIGN_UP } from 'app/utils/router';

const SignIn = ({navigation}: any) => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const passwordInputRef: any = useRef(null);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const muLogin = useMutation('login', {
    mutationFn: login,
    onSuccess: (response: any) => {
      const user = response?.data?.data;
      queryClient.removeQueries();
      if (user?._id) {
        if (user.AccountType === 2) {
          dispatch(userAction.setCurrentUser(user));
        } else {
          Alert.alert(t('signinNotVerifiedUser'));
        }
      } else {
        Alert.alert(response?.data?.message);
      }
    },
    onError: () => {},
  });
  const {control, handleSubmit, formState} = useForm();
  const errors = formState.errors;
  const onSubmit = (data: any) => muLogin.mutate({...data, DeviceType: 2});

  return (
    <BasicLayout isLoading={muLogin.isLoading}>
      <SafeAreaView className="flex-1">
        <ScrollView className="h-full">
          <View className="p-8">
            <View className="items-center">
              <LogoSvg />
            </View>
            <View className="items-center mt-8">
              <Text className="items-center text-[24px]">{t('getStarted')}</Text>
            </View>
            <View className="mt-8">
              <TextInput
                label="Email Address*"
                name="Email"
                rules={{required: true}}
                control={control}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current.focus()}
                error={errors.Email}
                rightIcon={<EmailIcon className="text-secondary" />}
              />
              {errors.Email && <Text className="text-orange-600 pt-0.5 text-[10px]">{t('invalidUsername')}</Text>}
            </View>
            <View className="mt-4">
              <TextInput
                comRef={passwordInputRef}
                label="Password*"
                name="Password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                secureTextEntry={!showPassword}
                control={control}
                rightIcon={showPassword ? <EyeOffIcon className="text-secondary" /> : <EyeIcon className="text-secondary" />}
                rightAction={() => setShowPassword(!showPassword)}
              />
            </View>
            <TouchableOpacity className="items-end mt-4" onPress={() => navigation.navigate(FORGOT_PASSWORD)}>
              <Text className="text-darkGreen">{t('forgotPassword')}</Text>
            </TouchableOpacity>
            <View className="items-center mt-8">
              <ButtonGreen onPress={handleSubmit(onSubmit)} className="uppercase">
                {t('login')}
              </ButtonGreen>
            </View>
            <View className="flex flex-row justify-center items-center">
              <Text className="text-black">{t('donAccount')}</Text>
              <Pressable className="px-2 py-3" onPress={() => navigation.navigate(SIGN_UP)}>
                <Text className="color-secondary font-semibold">{t('signUp')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BasicLayout>
  );
};
export default SignIn;
