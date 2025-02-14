/* eslint-disable react-hooks/exhaustive-deps */
import ButtonGreen from 'app/components/button/ButtonGreen';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import ArrowDownIcon from 'assets/svg/arrow-down.svg';
import CalendarIcon from 'assets/svg/calendar.svg';
import LocationIcon from 'assets/svg/location-outline.svg';
import {useTranslation} from 'react-i18next';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonOveline from 'app/components/button/ButtonOveline';
import {omit, values} from 'lodash';
import TextInput from 'app/components/TextInput';
import Text from 'app/components/Text';
import AlertSelectModal from 'app/components/Modal/AlertSelectModal';
import {ACTIVITY_EXPERIENCE_LEVEL, CATEGORIES, GENDER} from 'app/utils/constants';
import LocationModal from 'app/components/Modal/LocationModal';
import {useMutation} from 'react-query';
// import ROUTER from 'app/navigation/router';
import { router } from 'expo-router';
import GrayLayout from 'app/layout/GrayLayout';
import {countries} from 'app/utils/countryCode';
import PageSelectModal from 'app/components/Modal/PageSelectModal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import {updateProfile} from 'app/api/userApi';
import {userAction} from 'app/store/actions';
import Alert from 'app/components/Alert';
import { PROFILE_MENU } from 'app/utils/router';

const EditProfile = (props: any) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {currentUser} = useSelector(userSelector);
  const newCountries = countries.map(c => ({id: c.code, name: `${c.name} (${c.code})`}));
  const [countryCode, setCountryCode]: any = useState(newCountries.find((c: any) => c.id === '+1'));
  const [modalCountryCode, setModalCountryCode] = useState(false);
  const [modalGender, setModalGender] = useState(false);
  const [dateOfBirth, setDateOfBirth]: any = useState(currentUser.DateOfBirth || undefined);
  const [modalAP, setModalAP] = useState(false);
  const [modalAEL, setModalAEL] = useState(false);
  const [modalOB, setModalOB] = useState(false);
  const [locationModal, setLocationModal]: any = useState(false);
  const DateOfBirth = currentUser.DateOfBirth ? moment(currentUser.DateOfBirth).format('ll') : null;
  const {control, handleSubmit, setValue, clearErrors, formState} = useForm({defaultValues: {...currentUser, DateOfBirth}});
  const errors = formState.errors;

  const mutUpdateProfile = useMutation('updateProfile', {
    mutationFn: updateProfile,
    onSuccess: ({data}: any, variables) => {
      if (data?.code === 200) {
        dispatch(userAction.updateCurrentUser(variables));
        router.navigate(PROFILE_MENU);
      }
      Alert.alert(data.message);
    },
  });

  const onSubmit = (value: any) => {
    const payload = {...omit(value, ['_id', 'AccessToken', 'Image', 'DisplayUniqueId', 'LoginAt']), DateOfBirth: dateOfBirth};
    mutUpdateProfile.mutate(payload);
  };

  const handleCountryCode = (value: any) => {
    setCountryCode(value);
  };

  const handleDateOfBirth = (date: any) => {
    setModalOB(false);
    setValue('DateOfBirth', moment(date).format('ll'));
    setDateOfBirth(moment(date).format('YYYY-MM-DD'));
    clearErrors('DateOfBirth');
  };

  const handleSelectLocation = (feature: any) => {
    setLocationModal(false);
    setValue('Address', feature.place_name);
    clearErrors('Address');
  };

  const handleGender = (gender: any) => {
    setValue('Gender', gender);
  };

  const handleAP = (value: any) => {
    setValue('ActivityPreference', value);
    clearErrors('ActivityPreference');
  };
  const handleAEL = (value: any) => {
    setValue('ActivityExpertise', value);
    clearErrors('ActivityExpertise');
  };

  const renderLeftInputCountryCode = () => (
    <View className="flex-row items-center pl-1 pr-2 border-r border-border">
      <Text className="w-12 text-textContainer text-right pr-2">{countryCode.id}</Text>
      <ArrowDownIcon />
    </View>
  );

  return (
    <GrayLayout {...props} isLoading={mutUpdateProfile.isLoading}>
      {/* <KeyboardAwareScrollView className="flex-1" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View className="items-center justify-center px-4 pb-2">
          <View className="flex flex-row mt-6 w-full">
            <View className="basis-1/2 pr-2">
              <TextInput label={t('firstName')} name="FirstName" rules={{required: true}} error={errors.FirstName} control={control} />
              {errors.FirstName && <Text className="text-orange-600 pt-0.5 text-[10px]">{t('firstNameRequired')}</Text>}
            </View>
            <View className="basis-1/2 pl-2">
              <TextInput label={t('lastName')} name="LastName" rules={{required: true}} error={errors.LastName} control={control} />
              {errors.LastName && <Text className="text-orange-600 pt-0.5 text-[10px]">{t('lastNameRequired')}</Text>}
            </View>
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('phoneNumber')}
              name="PhoneNumber"
              mask="[000]-[000]-[0000]"
              rules={{required: true, minLength: 12, maxLength: 12}}
              error={errors.PhoneNumber}
              control={control}
              leftIcon={renderLeftInputCountryCode()}
              leftAction={() => setModalCountryCode(true)}
            />
            {errors.PhoneNumber && <Text className="text-orange-600 pt-0.5 text-[10px]">{t('invalidPhoneNumber')}</Text>}
          </View>
          <View className="flex flex-row mt-4 w-full">
            <View className="basis-1/2 pr-2">
              <TextInput
                label={t('dateOfBirth')}
                name="DateOfBirth"
                control={control}
                rightIcon={<CalendarIcon className="text-secondary" />}
                onPress={() => setModalOB(true)}
              />
            </View>
            <View className="basis-1/2 pl-2">
              <TextInput label={t('gender')} name="Gender" control={control} rightIcon={ArrowDownIcon} onPress={() => setModalGender(true)} />
            </View>
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('address')}
              name="Address"
              control={control}
              rightIcon={<LocationIcon className="text-secondary" />}
              onPress={() => setLocationModal(true)}
            />
          </View>
          <View className="mt-4 w-full">
            <TextInput label={t('unit')} name="Unit" control={control} />
          </View>
          <View className="flex flex-row mt-4 w-full">
            <View className="basis-1/2 pr-2">
              <TextInput
                label={t('activityPreference')}
                name="ActivityPreference"
                rules={{required: t('activityPreferenceRequired')}}
                error={errors.ActivityPreference}
                control={control}
                rightIcon={ArrowDownIcon}
                onPress={() => setModalAP(true)}
              />
              {errors.ActivityPreference && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.ActivityPreference.message}</Text>}
            </View>
            <View className="basis-1/2 pl-2">
              <TextInput
                label={t('activityExpertise')}
                name="ActivityExpertise"
                rules={{required: t('activityExpertisesRequired')}}
                error={errors.ActivityExpertise}
                control={control}
                rightIcon={ArrowDownIcon}
                onPress={() => setModalAEL(true)}
              />
              {errors.ActivityExpertise && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.ActivityExpertise.message}</Text>}
            </View>
          </View>
          <View className="flex flex-row mt-4 w-full"></View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('aboutMe')}
              name="AboutMe"
              rules={{required: t('aboutMeRequired'), minLength: {value: 50, message: t('min50')}}}
              error={errors.AboutMe}
              multiline={true}
              numberOfLines={10}
              height={100}
              control={control}
            />
            {errors.AboutMe && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.AboutMe.message}</Text>}
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('trainingGoals')}
              name="TrainingGoals"
              multiline={true}
              rules={{required: t('trainingGoalsRequired'), minLength: {value: 50, message: t('min50')}}}
              error={errors.TrainingGoals}
              numberOfLines={10}
              height={100}
              control={control}
            />
            {errors.TrainingGoals && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.TrainingGoals.message}</Text>}
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('fitnessAchievements')}
              name="FitnessAchievements"
              multiline={true}
              rules={{required: t('fitnessAchievementsRequired'), minLength: {value: 50, message: t('min50')}}}
              error={errors.FitnessAchievements}
              numberOfLines={10}
              height={100}
              control={control}
            />
            {errors.FitnessAchievements && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.FitnessAchievements.message}</Text>}
          </View>
        </View>
      </KeyboardAwareScrollView> */}
      <SafeAreaView className="mb-4">
        <View className="w-full px-4 pt-2 bg-bgScreen" style={styles.shadowBottom}>
          <View className=" flex-row justify-between">
            <View className="flex-1 basis-1/2 pr-2">
              <ButtonOveline onPress={() => router.navigate(PROFILE_MENU)}>{t('cancel')}</ButtonOveline>
            </View>
            <View className="flex-1 basis-1/2 pl-2">
              <ButtonGreen onPress={handleSubmit(onSubmit)}>{t('Save')}</ButtonGreen>
            </View>
          </View>
        </View>
      </SafeAreaView>
      {/* {modalOB && (
        <DatePicker
          modal
          theme="light"
          androidVariant="iosClone"
          open={modalOB}
          date={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          onConfirm={handleDateOfBirth}
          onCancel={() => setModalOB(false)}
        />
      )} */}
      <PageSelectModal
        {...{modal: modalCountryCode, setModal: setModalCountryCode, title: t('countryCode')}}
        {...{onSelect: handleCountryCode, itemSelect: countryCode, items: newCountries}}
      />
      <LocationModal {...{modal: locationModal, setModal: setLocationModal, handleSelect: handleSelectLocation}} />
      <AlertSelectModal {...{modal: modalGender, setModal: setModalGender, title: t('gender'), onSelect: handleGender, items: GENDER}} />
      <AlertSelectModal {...{modal: modalAP, setModal: setModalAP, title: t('activityPreference'), onSelect: handleAP, items: values(CATEGORIES)}} />
      <AlertSelectModal
        {...{modal: modalAEL, setModal: setModalAEL, title: t('activityExpertise'), onSelect: handleAEL, items: ACTIVITY_EXPERIENCE_LEVEL}}
      />
    </GrayLayout>
  );
};

const styles = StyleSheet.create({
  shadowBottom: {
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 1,
    shadowRadius: 7.0,
    elevation: 2,
  },
});

export default EditProfile;
