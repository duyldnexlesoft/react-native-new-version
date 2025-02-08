import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SignInScreen from 'app/screens/authen/SignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userAction} from 'app/store/actions';
import {useQuery} from 'react-query';
import {BANK_LINK, CURRENT_USER} from 'app/utils/constants';
// import BootSplash from 'react-native-bootsplash';
import ROUTER from './router';
// import ServiceDetail from 'app/screens/Services/ServiceDetail';
import {getProfile} from 'app/api/userApi';
// import BookingDetail from 'app/screens/Bookings/BookingDetail';
// import AthleteDetail from 'app/screens/Bookings/AthleteDetail';
// import Messages from 'app/screens/Bookings/Messages';
// import ForgotPassword from 'app/screens/Authen/ForgotPassword';
// import ConfirmPasswordCode from 'app/screens/Authen/ConfirmPasswordCode';
// import ResetPassword from 'app/screens/Authen/ResetPassword';
// import SignUp from 'app/screens/Authen/SignUp';
import {createBankStripe} from 'app/api/bankApi';
// import ManagePhotos from 'app/screens/profile/ManagePhotos';
// import ChangePassword from 'app/screens/profile/ChangePassword';
// import EditProfile from 'app/screens/profile/EditProfile';
// import Support from 'app/screens/profile/Support';
// import Services from 'app/screens/Services/Services';
// import Bookings from 'app/screens/Bookings/Bookings';
// import Availability from 'app/screens/Availability/Availability';
// import Bank from 'app/screens/Bank/Bank';
// import ProfileMenu from 'app/screens/profile/ProfileMenu';
import {View, Text} from 'react-native';
import { userSelector } from 'app/store/selectors';

const Stack = createNativeStackNavigator();
const linking = {
  prefixes: ['sherpaprovider://'],
  config: {screens: {[ROUTER.HOME]: {screens: {[ROUTER.BANK]: BANK_LINK}}}},
};

// const TabNavigator = () => {
//   const {currentUser} = useSelector(userSelector);
//   return (
//     <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
//       {currentUser?.StripeBankId && <Stack.Screen name={ROUTER.SERVICES} component={Services} />}
//       <Stack.Screen name={ROUTER.BOOKINGS} component={Bookings} />
//       <Stack.Screen name={ROUTER.AVAILABILITY} component={Availability} />
//       <Stack.Screen name={ROUTER.BANK} component={Bank} />
//       <Stack.Screen name={ROUTER.PROFILE} component={ProfileMenu} />
//     </Stack.Navigator>
//   );
// };

// const StackScreenAuthen = () => (
//   <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
//     <Stack.Screen name={ROUTER.HOME} component={TabNavigator} />
//     <Stack.Screen name={ROUTER.SERVICE_DETAIL} component={ServiceDetail} />
//     <Stack.Screen name={ROUTER.PHOTOS} component={ManagePhotos} />
//     <Stack.Screen name={ROUTER.CHANGE_PASSWORD} component={ChangePassword} />
//     <Stack.Screen name={ROUTER.EDIT_PROFILE} component={EditProfile} />
//     <Stack.Screen name={ROUTER.SUPPORT} component={Support} />
//     <Stack.Screen name={ROUTER.BOOKING_DEAIL} component={BookingDetail} />
//     <Stack.Screen name={ROUTER.ATHLETE_DETAIL} component={AthleteDetail} />
//     <Stack.Screen name={ROUTER.MESSAGES} component={Messages} />
//   </Stack.Navigator>
// );

// const StackScreenNoAuthen = () => (
//   <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
//     <Stack.Screen name={ROUTER.SIGN_IN} component={SignInScreen} />
//     <Stack.Screen name={ROUTER.SIGN_UP} component={SignUp} />
//     <Stack.Screen name={ROUTER.FORGOT_PASSWORD} component={ForgotPassword} />
//     <Stack.Screen name={ROUTER.EMAIL_VERTIFICATION} component={ConfirmPasswordCode} />
//     <Stack.Screen name={ROUTER.RESET_PASSWORD} component={ResetPassword} />
//   </Stack.Navigator>
// );

const AppNavigator = (props: any) => {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(userSelector);

  const getStorageCurrentUser = async () => {
    const userStorage: any = await AsyncStorage.getItem(CURRENT_USER);
    if (userStorage) {
      const user = JSON.parse(userStorage);
      const resCreateBank = await createBankStripe();
      if (resCreateBank?.data?.code === 401) return;
      const response = await getProfile(user._id);
      dispatch(userAction.setCurrentUser({...user, ...response?.data?.data}));
    }
  };
  // const {isLoading} = useQuery(['getStorageCurrentUser'], () => getStorageCurrentUser());

  // if (isLoading && !currentUser) {
  //   return <View />;
  // }
  return (
    <View><Text className='text-gray-600'>dasdasddas</Text></View>
    // <NavigationContainer linking={linking} onReady={() => BootSplash.hide({fade: true})} {...props}>
    // <NavigationContainer linking={linking} {...props}>
    //   {currentUser ? <StackScreenAuthen /> : <StackScreenNoAuthen />}
    // </NavigationContainer>
  );
};

export default AppNavigator;
