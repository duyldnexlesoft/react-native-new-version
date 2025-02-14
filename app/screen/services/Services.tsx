/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import Text from 'app/components/Text';
import Add16Icon from 'assets/svg/add16.svg';
import TrashIcon from 'assets/svg/trash22.svg';
import ImageIcon from 'assets/svg/image.svg';
import SearchIcon from 'assets/svg/search.svg';
import ClearIcon from 'assets/svg/clear.svg';
import Glass60Icon from 'assets/svg/glass60.svg';
import RunnermanIcon from 'assets/svg/runnerman.svg';
import AddCardIcon from 'assets/svg/add-card.svg';
// import {SwipeListView} from 'react-native-swipe-list-view';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import {deleteService, getService} from 'app/api/serviceApi';
import {concat, isEmpty, size} from 'lodash';
import {LIMIT_ITEM, STATUS_SERVICE} from 'app/utils/constants';
import Image from 'app/components/Image';
// import ROUTER from 'app/navigation/router';
import { router } from 'expo-router';
import {useTranslation} from 'react-i18next';
import BlueLayout from 'app/layout/BlueLayout';
import ConfirmModal from 'app/components/Modal/ConfirmModal';
import NavBar from 'app/components/NavBar';
import Alert from 'app/components/Alert';
import { SERVICE_DETAIL } from 'app/utils/router';

const Services = (props: any) => {
  const {t} = useTranslation();
  const {currentUser} = useSelector(userSelector);
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue]: any = useState('');
  const [services, setServices]: any = useState([]);
  const [serviceId, setServiceId]: any = useState(null);
  const [totalServices, setTotalServices]: any = useState(0);
  const [skip, setSkip]: any = useState(0);
  const [modal, setModal] = useState(false);
  const swipeListViewRef: any = useRef(null);
  const {isLoading} = useQuery(
    ['getService', currentUser._id, skip, searchValue],
    () => getService({skip, limit: LIMIT_ITEM, VerifiedUserId: currentUser._id, searchValue, status: STATUS_SERVICE.ACTIVE}),
    {
      onSuccess: () => handleQueryData(searchValue, skip),
      staleTime: Infinity,
    },
  );

  const muDeleteService = useMutation('deleteService', {
    mutationFn: deleteService,
    onSuccess: (response: any) => {
      if (response?.data?.code === 200) {
        queryClient.invalidateQueries('getService');
      } else {
        Alert.alert(response?.data?.message);
      }
    },
    onError: () => {},
  });

  const handleQueryData = (searchValue: any, skip: any) => {
    const data: any = queryClient.getQueryData(['getService', currentUser._id, skip, searchValue]);
    setSkip(skip);
    setSearchValue(searchValue);
    if (data?.data?.data) {
      setServices(concat(skip ? services : [], data?.data?.data?.edges || []));
      setTotalServices(data?.data?.data?.pageInfo?.[0]?.count || 0);
    }
  };

  const handleScroll = (event: any) => {
    const {contentSize, contentOffset, layoutMeasurement} = event.nativeEvent;
    const checkScroll = contentOffset.y > 0 && layoutMeasurement.height / (contentSize.height - contentOffset.y) > 0.6;
    if (checkScroll && !isLoading && totalServices > size(services)) {
      handleQueryData(searchValue, skip + LIMIT_ITEM);
    }
  };

  const onRefresh = () => {
    setSkip(0);
    setSearchValue('');
    setTimeout(() => queryClient.invalidateQueries('getService'));
  };

  const confirm = () => {
    swipeListViewRef?.current?.closeAllOpenRows();
    muDeleteService.mutate(serviceId);
  };

  const renderRight = () => (
    <TouchableOpacity className="w-9 h-9 items-center justify-center" onPress={() => router.navigate(SERVICE_DETAIL)}>
      <Add16Icon className="text-white" width={22} height={22} />
    </TouchableOpacity>
  );

  return (
    <BlueLayout {...props} isLoading={muDeleteService.isLoading} renderRight={renderRight}>
      {isEmpty(services) && isEmpty(searchValue) && !isLoading && (
        <View className="items-center justify-center h-[70%]">
          <RunnermanIcon className="text-brown mb-6" width={54} height={54} />
          <Text className="text-xl font-bold text-brown">{t('noServices')}</Text>
          <Text className="text-base text-brown mt-1.5">{t('noServicesNote')}</Text>
          <TouchableOpacity onPress={() => router.navigate(SERVICE_DETAIL)} className="flex-row items-center mt-6">
            <AddCardIcon className="text-darkRed" />
            <Text className="pl-2 text-darkRed text-base font-medium">{t('addNewService')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {(!isEmpty(services) || !isEmpty(searchValue)) && (
        <View className="px-4 mt-4">
          <View className="bg-bgLightGray w-full rounded flex-row items-center justify-between">
            <TextInput
              placeholder="Search"
              className="px-4 h-12 flex-1"
              value={searchValue}
              onChange={event => handleQueryData(event.nativeEvent.text, 0)}
            />
            <Pressable className="p-4 h-12 flex justify-center items-center" onPress={() => handleQueryData('', skip)}>
              {!searchValue ? <SearchIcon className="text-secondary" /> : <ClearIcon />}
            </Pressable>
          </View>
        </View>
      )}

      {isEmpty(services) && !isEmpty(searchValue) && (
        <View className="items-center justify-center h-[70%]">
          <Glass60Icon className="text-brown mb-4" width={54} height={54} />
          <Text className="text-xl font-bold text-brown">{t('noResults')}</Text>
          <Text className="text-base text-brown mt-1">{t('noResultsDescription')}</Text>
        </View>
      )}
      <ScrollView scrollEventThrottle={16} onScroll={handleScroll} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        {/* <SwipeListView
          ref={swipeListViewRef}
          scrollEnabled={false}
          data={services}
          renderItem={({item}: any, _rowMap) => (
            <ServiceItem item={item} onPress={() => router.navigate({pathname: SERVICE_DETAIL, params: {service: item}})} />
          )}
          renderHiddenItem={({item}: any, _rowMap) => (
            <View className="flex-1 h-[100px]">
              <View className="absolute top-0 bottom-0 right-0 w-[120px] bg-red-500">
                <TouchableOpacity
                  className="flex-1 items-end justify-center pr-5"
                  onPress={() => {
                    setServiceId(item._id);
                    setModal(true);
                  }}>
                  <TrashIcon className="text-white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          rightOpenValue={-65}
        /> */}
      </ScrollView>
      {/* <NavBar {...props} focused={ROUTER.SERVICES} /> */}
      <ConfirmModal {...{modal, setModal, confirm, title: t('deleteService'), note: t('deleteServiceNote')}} />
    </BlueLayout>
  );
};

const ServiceItem = ({item, onPress}: any) => (
  <Pressable onPress={onPress} className="flex-row p-4 bg-bgScreen items-center border-b border-tabDefault">
    <View className="h-[40px] w-[62px] rounded bg-bgLightGray overflow-hidden items-center justify-center">
      {isEmpty(item.Images) && <ImageIcon className="text-brown" width={20} height={20} />}
      {!isEmpty(item.Images) && <Image className="w-full h-full rounded-t-md" uri={item?.Images?.[0]} />}
    </View>
    <View className="px-3 flex-1">
      <Text className="text-[16px] pb-1 font-medium text-black" numberOfLines={1} ellipsizeMode="tail">
        {item.Name}
      </Text>
      <View className="flex-row items-center">
        <Text className="text-darkBrown">{item.DefaultAmountTime}</Text>
        <Text className="text-darkBrown font-medium">{` $${(item.Amount / 100).toFixed(2)}/h`}</Text>
      </View>
    </View>
  </Pressable>
);

export default Services;
