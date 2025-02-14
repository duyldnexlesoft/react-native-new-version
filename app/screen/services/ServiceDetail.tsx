/* eslint-disable react-hooks/exhaustive-deps */
import ButtonGreen from 'app/components/button/ButtonGreen';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import ArrowDownIcon from 'assets/svg/arrow-down.svg';
import CalendarIcon from 'assets/svg/calendar.svg';
import LocationIcon from 'assets/svg/location-outline.svg';
import {useTranslation} from 'react-i18next';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonOveline from 'app/components/button/ButtonOveline';
import EditGallery from 'app/components/gallerry/EditGallery';
import {cloneDeep, values, split, concat, filter, isEmpty, map, pick, isString, last} from 'lodash';
import TextInput from 'app/components/TextInput';
import Text from 'app/components/Text';
import AlertSelectModal from 'app/components/Modal/AlertSelectModal';
import {CATEGORIES} from 'app/utils/constants';
import LocationModal from 'app/components/Modal/LocationModal';
import {useMutation, useQueryClient} from 'react-query';
import {createService, updateService} from 'app/api/serviceApi';
// import ROUTER from 'app/navigation/router';
import { router } from 'expo-router';
import GrayLayout from 'app/layout/GrayLayout';
import {useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import NotificationServiceModal from 'app/components/Modal/NotificationServiceModal';
import Alert from 'app/components/Alert';
import { SERVICES } from 'app/utils/router';

const ServiceDetail = (props: any) => {
  const {t} = useTranslation();
  const {currentUser} = useSelector(userSelector);
  const service = props?.route?.params?.service;
  const queryClient = useQueryClient();
  const [images, setImages]: any = useState(service?.Images || []);
  const [modalCategory, setModalCategory]: any = useState(false);
  const [startAddressModal, setStartAddressModal]: any = useState(false);
  const [endAddressModal, setEndAddressModal]: any = useState(false);
  const [notiModal, setNotiModal]: any = useState(false);

  const Amount = `${service ? service?.Amount / 100 : ''}`;
  const {control, handleSubmit, setValue, formState} = useForm({defaultValues: {...service, Amount} || {}});
  const errors = formState.errors;

  const mutCreateService = useMutation('createService', {
    mutationFn: createService,
    onSuccess: ({data}: any) => {
      if (data?.code === 201) {
        queryClient.invalidateQueries('getService');
        router.navigate(SERVICES);
      } else {
        Alert.alert(data.message);
      }
    },
  });

  const mutUpdateService = useMutation('updateService', {
    mutationFn: updateService,
    onSuccess: ({data}: any) => {
      if (data?.code === 200) {
        queryClient.invalidateQueries('getService');
        router.navigate(SERVICES);
      } else {
        Alert.alert(data.message);
      }
    },
  });

  const onSubmit = (value: any) => {
    const formData = new FormData();
    const pickKeys = ['Amount', 'Category', 'DefaultAmountTime', 'Description', 'EndAddress', 'Name', 'SpecialInstruction', 'StartAddress', '_id'];
    const payload: any = pick(value, pickKeys);

    Object.keys(payload).forEach(key => {
      if (value[key] !== undefined) formData.append(key, payload[key]);
    });

    const Images = map(images, img => (isString(img) ? last(split(img, '/')) : 'upload')).join(',');
    formData.append('Images', Images);

    images?.forEach((file: any) => {
      if (!isString(file)) {
        const newFile = cloneDeep(file);
        newFile.uri = Platform.OS === 'ios' ? newFile.uri.replace('file://', '') : newFile.uri;
        newFile.name = file.fileName;
        formData.append('upload', newFile);
      }
    });
    if (isEmpty(service)) {
      if (isEmpty(currentUser.Images)) {
        setNotiModal(true);
      } else {
        mutCreateService.mutate(formData);
      }
    } else {
      mutUpdateService.mutate(formData);
    }
  };

  const onChangeImage = async (payload: any) => {
    if (payload.addImage) {
      setImages(filter(concat(images, payload.addImage)));
      return payload.addImage.uri;
    } else if (payload.delIndex !== undefined) {
      setImages(filter(images, (img, index) => !!img && index !== payload.delIndex));
    } else if (payload.changeIndex) {
      const [form, to] = payload.changeIndex;
      const newImages = cloneDeep(images);
      newImages[form] = images[to];
      newImages[to] = images[form];
      setImages(filter(newImages));
    }
  };

  const formatAmountTime = (event: any) => {
    const [text1, text2] = split(event.nativeEvent.text, ':');
    if (!!text2) setValue('DefaultAmountTime', `${text1}:${Number(text2) < 60 ? text2 : '59'}`);
  };

  const handleCategory = (value: any) => setValue('Category', value);

  const handleSelectStartAddress = (feature: any) => setValue('StartAddress', feature.place_name);

  const handleSelectEndAddress = (feature: any) => setValue('EndAddress', feature.place_name);

  return (
    <GrayLayout {...props} isLoading={mutCreateService.isLoading || mutUpdateService.isLoading}>
      {/* <KeyboardAwareScrollView className="flex-1" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <EditGallery ratio={2 / 3} images={service?.Images || []} onChange={onChangeImage} maxSize={6} />
        <View className="items-center justify-center px-4 pb-2">
          <View className="w-full">
            <TextInput label={t('name')} name="Name" rules={{required: t('fieldRequired')}} error={errors.Name} control={control} />
            {errors.Name && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.Name.message}</Text>}
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={`${t('category')} *`}
              name="Category"
              rules={{required: t('fieldRequired')}}
              error={errors.Category}
              control={control}
              rightIcon={ArrowDownIcon}
              onPress={() => setModalCategory(true)}
            />
            {errors.Category && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.Category.message}</Text>}
          </View>
          <View className="flex flex-row mt-4 w-full">
            <View className="basis-1/2 pr-2">
              <TextInput
                label={`${t('pricePerHour')} *`}
                name="Amount"
                keyboardType="numeric"
                rules={{required: t('fieldRequired')}}
                error={errors.Amount}
                control={control}
              />
              {errors.Amount && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.Amount.message}</Text>}
            </View>
            <View className="basis-1/2 pl-2">
              <TextInput
                label={`${t('defaulDuration')} *`}
                name="DefaultAmountTime"
                keyboardType="numeric"
                mask="[00]:[00]"
                rules={{required: t('fieldRequired')}}
                error={errors.DefaultAmountTime}
                control={control}
                onChange={formatAmountTime}
                rightIcon={<CalendarIcon className="text-secondary" />}
              />
              {errors.DefaultAmountTime && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.DefaultAmountTime.message}</Text>}
            </View>
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={`${t('startAddress')} *`}
              name="StartAddress"
              rules={{required: t('fieldRequired')}}
              error={errors.StartAddress}
              control={control}
              onPress={() => setStartAddressModal(true)}
              rightIcon={<LocationIcon className="text-secondary" />}
            />
            {errors.StartAddress && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.StartAddress.message}</Text>}
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('endAddress')}
              name="EndAddress"
              control={control}
              onPress={() => setEndAddressModal(true)}
              rightIcon={<LocationIcon className="text-secondary" />}
            />
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={`${t('description')} *`}
              name="Description"
              multiline={true}
              rules={{required: t('fieldRequired'), minLength: {value: 50, message: t('min50')}}}
              error={errors.Description}
              numberOfLines={10}
              height={100}
              control={control}
            />
            {errors.Description && <Text className="text-orange-600 pt-0.5 text-[10px]">{errors.Description.message}</Text>}
          </View>
          <View className="mt-4 w-full">
            <TextInput
              label={t('specialInstructions')}
              name="SpecialInstruction"
              multiline={true}
              numberOfLines={10}
              height={100}
              control={control}
            />
          </View>
        </View>
      </KeyboardAwareScrollView> */}
      <SafeAreaView className="mb-4">
        <View className="w-full px-4 pt-2 bg-bgScreen" style={styles.shadowBottom}>
          <View className=" flex-row justify-between">
            <View className="flex-1 basis-1/2 pr-2">
              <ButtonOveline onPress={() => router.navigate(SERVICES)}>{t('cancel')}</ButtonOveline>
            </View>
            <View className="flex-1 basis-1/2 pl-2">
              <ButtonGreen onPress={handleSubmit(onSubmit)}>{t('submit')}</ButtonGreen>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <AlertSelectModal
        {...{modal: modalCategory, setModal: setModalCategory, onSelect: handleCategory, title: t('category'), items: values(CATEGORIES)}}
      />
      <LocationModal {...{modal: startAddressModal, setModal: setStartAddressModal, handleSelect: handleSelectStartAddress}} />
      <LocationModal {...{modal: endAddressModal, setModal: setEndAddressModal, handleSelect: handleSelectEndAddress}} />
      <NotificationServiceModal {...{modal: notiModal, setModal: setNotiModal, navigation: props.navigation}} />
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
  },
});

export default ServiceDetail;
