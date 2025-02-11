import { useSelector, useDispatch } from "react-redux";
import { View, Text, Button } from "react-native";
import { userSelector } from "app/store/selectors";
import { useNavigation } from "expo-router";
import LogoSvg from 'assets/svg/logo.svg';
import { useEffect } from "react";

export default function Signin() {
  const navigation = useNavigation();
  const { currentUser } = useSelector(userSelector);

  // useEffect(() => {
  //   navigation.setOptions({ headerShown: true });
  // }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LogoSvg />
      <Text style={{ fontSize: 24 }}>Signin</Text>
    </View>
  );
}

export const options = {
  headerShown: false,
};
