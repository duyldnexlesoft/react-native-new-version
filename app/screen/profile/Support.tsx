import React from 'react';
import {Dimensions, SafeAreaView, ScrollView, View} from 'react-native';
import {useMutation} from 'react-query';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import TextInput from 'app/components/TextInput';
import SupportIcon from 'assets/svg/support-girl.svg';
import Text from 'app/components/Text';
import ButtonGreen from 'app/components/button/ButtonGreen';
import {userSelector} from 'app/store/selectors';
import {useSelector} from 'react-redux';
import {sendMailToSupport} from 'app/api/supportApi';
import { router } from 'expo-router';
import GrayLayout from 'app/layout/GrayLayout';
import BgSignin from 'assets/svg/bg-signin.svg';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Alert from 'app/components/Alert';
import { PROFILE_MENU } from 'app/utils/router';
const dimensions = Dimensions.get('screen');

const Support = (props: any) => {
  const {t} = useTranslation();
  const {currentUser} = useSelector(userSelector);

  const muSendMailToSupport = useMutation('sendMailToSupport', {
    mutationFn: sendMailToSupport,
    onSuccess: (response: any) => {
      if (response?.data?.code === 201) {
        Alert.alert(t('sendSupportSuccess'));
        router.navigate(PROFILE_MENU);
      } else {
        Alert.alert(t('supportError'));
      }
    },
    onError: () => Alert.alert(t('supportError')),
  });

  const {control, handleSubmit, formState} = useForm();
  const errors = formState.errors;

  const onSubmit = ({Message}: any) => {
    const GivenByVerifiedUserId = currentUser._id;
    muSendMailToSupport.mutate({GivenByVerifiedUserId, Message});
  };

  return (
    <GrayLayout {...props} isLoading={muSendMailToSupport.isLoading}>
      <View className="absolute bottom-[-1px] w-full">
        <BgSignin width={dimensions.width} height={(42 * dimensions.width) / 375} />
      </View>
      <SafeAreaView className="flex-1">
        {/* <KeyboardAwareScrollView className="flex-1">
          <ScrollView>
            <View className="p-8">
              <View className="items-center">
                <SupportIcon />
                <Text className="text-textContainer font-medium pt-4 text-center">{t('supportDescription')}</Text>
              </View>
              <View className="mt-6 w-full">
                <TextInput
                  label={t('supportTell')}
                  name="Message"
                  rules={{required: true}}
                  control={control}
                  returnKeyType="next"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  error={errors.Message}
                  multiline={true}
                  numberOfLines={10}
                  height={150}
                />
              </View>
              <View className="items-center mt-8">
                <ButtonGreen className="uppercase" onPress={handleSubmit(onSubmit)}>
                  {t('submit')}
                </ButtonGreen>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView> */}
      </SafeAreaView>
    </GrayLayout>
  );
};

export default Support;
