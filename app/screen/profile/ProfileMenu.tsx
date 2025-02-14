/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from 'app/components/Text';
import BgProfileIcon from 'assets/svg/bgProfile.svg';
import BgProfileBotIcon from 'assets/svg/bgProfileBot.svg';
import ImageIcon from 'assets/svg/image.svg';
import LockIcon from 'assets/svg/lock.svg';
import Lock2Icon from 'assets/svg/user-remove.svg';
import ArrowRightIcon from 'assets/svg/arrow-right.svg';
import PencilIcon from 'assets/svg/pencil.svg';
import SupportIcon from 'assets/svg/support.svg';
import {useDispatch, useSelector} from 'react-redux';
import ColorLayout from 'app/layout/ColorLayout';
import { router } from 'expo-router';
import {useTranslation} from 'react-i18next';
import {userSelector} from 'app/store/selectors';
import {trim} from 'lodash';
import ConfirmModal from 'app/components/Modal/ConfirmModal';
import {userAction} from 'app/store/actions';
import Avatar from 'app/components/Avatar';
import NavBar from 'app/components/NavBar';
import DeleteUserModal from 'app/components/Modal/DeleteUserModal';
import {useMutation} from 'react-query';
import {deleteUser} from 'app/api/userApi';
import { CHANGE_PASSWORD, EDIT_PROFILE, SUPPORT } from 'app/utils/router';
const dimensions = Dimensions.get('screen');

const ProfileMenu = (props: any) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {currentUser} = useSelector(userSelector);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [modal, setModal] = useState(false);
  
  const muDeleteUser = useMutation('deleteUser', {
    mutationFn: deleteUser,
    onSuccess: (response: any) => {
      if (response?.data?.code === 200) {
        dispatch(userAction.removeCurrentUser());
      }
    },
    onError: () => {},
  });

  const confirmLogout = () => {
    dispatch(userAction.removeCurrentUser());
  };

  const handleDeleteUser = () => {
    setDeleteUserModal(false);
    muDeleteUser.mutate();
  };

  return (
    <ColorLayout className="h-full">
      <View className="absolute w-full top-0">
        <BgProfileIcon width={dimensions.width} height={(815 * dimensions.width) / 375} />
      </View>
      <View className="absolute w-full bottom-[45px]">
        <BgProfileBotIcon width={dimensions.width} height={(101 * dimensions.width) / 375} />
      </View>
      <SafeAreaView className="flex-1 mt-2">
        <ScrollView>
          <View className="items-center justify-center">
            <View className="mb-2 relative pb-1.5">
              <Avatar className="w-20 h-20" style={styles.shadow} image={currentUser.Images?.[0]} />
              <View className="absolute w-20 bottom-0 items-center justify-center">
                <View className="bg-secondary px-2.5 py-1 rounded-full">
                  <Text className="uppercase text-xs font-medium text-white">{t('active')}</Text>
                </View>
              </View>
            </View>
            <Text className="text-textContainer text-2xl font-medium">
              {trim(`${currentUser.FirstName} ${currentUser.LastName}`) || t('myProfile')}
            </Text>
            <Text className="text-gray-500">{currentUser.Email}</Text>
            <View className="flex-row items-center justify-center mt-3">
              <Text className="pr-4 text-textContainer">{t('userId')}</Text>
              <View className="bg-lightGray rounded px-2 py-1">
                <Text className="text-textContainer">{currentUser._id}</Text>
              </View>
            </View>
          </View>
          <View className="rounded-lg bg-white mx-6 mt-6 divide-y divide-backgroundHover">
            <RowMenu lable={t('photos')} Icon={ImageIcon} onPress={() => router.navigate(EDIT_PROFILE)} />
            <RowMenu lable={t('editProfile')} Icon={PencilIcon} onPress={() => router.navigate(EDIT_PROFILE)} />
          </View>
          <View className="rounded-lg bg-white mx-6 mt-6 divide-y divide-backgroundHover">
            <RowMenu lable={t('changePassword')} Icon={LockIcon} onPress={() => router.navigate(CHANGE_PASSWORD)} />
            <RowMenu lable={t('support')} Icon={SupportIcon} onPress={() => router.navigate(SUPPORT)} />
            <RowMenu lable={t('deleteAccount')} Icon={Lock2Icon} onPress={() => setDeleteUserModal(true)} />
          </View>
          <View className="rounded-lg bg-white mx-6 mt-6 divide-y divide-backgroundHover">
            <TouchableOpacity className="p-3 flex-row justify-center items-center" onPress={() => setModal(true)}>
              <Text className="text-lg text-red-600 font-medium">{t('signOut')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* <NavBar {...props} focused={ROUTER.PROFILE} /> */}
      <DeleteUserModal {...{modal: deleteUserModal, setModal: setDeleteUserModal, onSubmit: handleDeleteUser}} />
      <ConfirmModal {...{modal, setModal, confirm: confirmLogout, title: t('signOut'), note: t('logOutDescription')}} />
    </ColorLayout>
  );
};

const RowMenu = (props: any) => {
  return (
    <TouchableOpacity className="px-4 py-3 flex-row justify-between items-center" {...props}>
      <View className="flex-row items-center">
        <props.Icon className="text-gray-500" />
        <Text className="text-lg text-black pl-3">{props.lable}</Text>
      </View>
      <ArrowRightIcon className="text-lightSecondary" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.32,
    elevation: 5,
  },
});
export default ProfileMenu;
