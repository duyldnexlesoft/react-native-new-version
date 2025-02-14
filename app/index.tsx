import { View, Text } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { useEffect } from "react";
import { SIGN_IN } from "app/utils/router";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "./store/selectors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CURRENT_USER } from "./utils/constants";
import { createBankStripe } from "./api/bankApi";
import { getProfile } from "./api/userApi";
import { userAction } from "./store/actions";
import { useQuery } from "react-query";

export default function HomeScreen(props: any) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);

  const getStorageCurrentUser = async () => {
    const userStorage: any = await AsyncStorage.getItem(CURRENT_USER);
    if (userStorage) {
      const user = JSON.parse(userStorage);
      const resCreateBank = await createBankStripe();
      if (resCreateBank?.data?.code === 401) return;
      const response = await getProfile(user._id);
      dispatch(userAction.setCurrentUser({ ...user, ...response?.data?.data }));
    }
  };
  const { isLoading } = useQuery(["getStorageCurrentUser"], () =>
    getStorageCurrentUser()
  );

  if (isLoading && !currentUser) {
    return <View />;
  }

  return <Redirect href={currentUser ? SIGN_IN : SIGN_IN} />;
}
