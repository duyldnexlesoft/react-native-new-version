/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Dimensions, Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from 'app/components/Text';
import CardIcon from 'assets/svg/card-payment-60.svg';
import AddCardIcon from 'assets/svg/add-card.svg';
import BankStripeIcon from 'assets/svg/bankStripe.svg';
import BlueLayout from 'app/layout/BlueLayout';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import {createBankStripe, deleteBank, getListBank, sherpaOnboard} from 'app/api/bankApi';
import ConfirmModal from 'app/components/Modal/ConfirmModal';
import {getProfile} from 'app/api/userApi';
import {userAction} from 'app/store/actions';
import NavBar from 'app/components/NavBar';
// import ROUTER from 'app/navigation/router';
import Alert from 'app/components/Alert';
const dimensions = Dimensions.get('screen');

const Bank = (props: any) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {currentUser} = useSelector(userSelector);
  const [bank, setBank]: any = useState(null);
  const width = dimensions.width - 32;
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const linkingSubscription = Linking.addEventListener('url', () => queryClient.invalidateQueries('handleCreateBankStripe'));
    return () => linkingSubscription.remove();
  }, []);

  useEffect(() => {
    return props.navigation.addListener('focus', () => queryClient.invalidateQueries('handleCreateBankStripe'));
  }, [props.navigation]);

  const handleCreateBankStripe = async () => {
    const createBankRes = await createBankStripe();
    if (![201, 200, 409].includes(createBankRes.data.code)) {
      Alert.alert(createBankRes.data.message);
    }
    getProfile(currentUser._id).then(response => dispatch(userAction.updateCurrentUser(response?.data?.data)));
    return getListBank();
  };
  const {isLoading} = useQuery(['handleCreateBankStripe', currentUser._id], () => handleCreateBankStripe(), {
    staleTime: Infinity,
    onSuccess: ({data}) => {
      setBank(data?.data?.[0]);
    },
    onError: () => {},
  });

  const muSherpaOnboard = useMutation('sherpaOnboard', {
    mutationFn: sherpaOnboard,
    onSuccess: ({data}: any) => Linking.openURL(data?.data?.onboadlink?.url),
    onError: () => {},
  });

  const muDeleteBank = useMutation('deleteBank', {
    mutationFn: deleteBank,
    onSuccess: ({data}: any) => {
      if (data?.code === 200) {
        queryClient.invalidateQueries('handleCreateBankStripe');
      } else {
        Alert.alert(data?.message);
      }
    },
    onError: () => {},
  });

  const onRefresh = () => queryClient.invalidateQueries('handleCreateBankStripe');
  const confirm = () => muDeleteBank.mutate();

  return (
    <BlueLayout {...props} isLoading={muDeleteBank.isLoading || muSherpaOnboard.isLoading}>
      <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        {!bank && !isLoading && (
          <View className="items-center justify-center h-[70%] p-8 pt-[200px]">
            <CardIcon className="text-brown mb-6" />
            <Text className="text-xl font-bold text-brown">{t('savedCards')}</Text>
            <Text className="text-base text-center text-brown mt-1.5">{t('savedCardsNote')}</Text>
            <TouchableOpacity onPress={() => muSherpaOnboard.mutate()} className="flex-row items-center mt-6">
              <AddCardIcon className="text-darkRed" />
              <Text className="pl-2 text-darkRed text-base font-medium">{t('addBankAccount')}</Text>
            </TouchableOpacity>
          </View>
        )}
        {!!bank && !isLoading && (
          <View className="p-4">
            <BankStripeIcon width={width} height={(70 * width) / 345} />
            <View className="bg-white divide-y divide-tabDefault mt-4 rounded-[10px]" style={styles.shadowBox}>
              <View className="p-4 flex-row">
                <Text className="w-32 text-lg">{t('number')}</Text>
                <Text className="font-medium text-lg">{`**** **** **** ${bank.last4}`}</Text>
              </View>
              <View className="p-4 flex-row">
                <Text className="w-32 text-lg">{t('bankName')}</Text>
                <Text className="font-medium text-lg">{bank.bank_name}</Text>
              </View>
              <View className="p-4 flex-row">
                <Text className="w-32 text-lg">{t('routingNo')}</Text>
                <Text className="font-medium text-lg">{bank.routing_number}</Text>
              </View>
            </View>
            <View className="items-center mt-2">
              <TouchableOpacity onPress={() => setModal(true)} className="flex-row items-center mt-3">
                <AddCardIcon className="text-darkRed" />
                <Text className="pl-2 text-darkRed text-base font-medium">{t('delBankAccount')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {/* <NavBar {...props} focused={ROUTER.BANK} /> */}
      <ConfirmModal {...{modal, setModal, confirm, title: t('delBankAccount'), rightTitle: t('delete'), note: t('delBankAccountDesc')}} />
    </BlueLayout>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.13,
    shadowRadius: 1.82,
    elevation: 2,
  },
});
export default Bank;
