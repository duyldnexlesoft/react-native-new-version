import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import Text from './Text';
import RunmanIcon from 'assets/svg/runman.svg';
import CartIcon from 'assets/svg/cart.svg';
import AvailabilityIcon from 'assets/svg/availability.svg';
import CardIcon from 'assets/svg/card-payment.svg';
import ProfileIcon from 'assets/svg/profile.svg';
// import ROUTER from 'app/navigation/router';
import {useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import { router } from 'expo-router';
import { AVAILABILITY, BANK, BOOKINGS, FORGOT_PASSWORD, PROFILE_MENU, SERVICES, SIGN_UP } from 'app/utils/router';

const NavItem = ({focused, navigation, routerLink, name, Icon}: any) => (
  <Pressable className="flex-1 items-center" onPress={() => router.navigate(routerLink)}>
    <Icon className={focused === router ? 'text-secondary' : 'text-brown'} height={24} />
    <Text className={`text-xs pt-2 ${focused === router ? 'text-secondary' : 'text-brown'}`}>{name}</Text>
  </Pressable>
);

const NavBar = (props: any) => {
  const {currentUser} = useSelector(userSelector);
  return (
    <View className="w-full rounded-t-[20px] bg-white border border-white pt-4" style={styles.shadowBox}>
      <SafeAreaView className="flex-row justify-between pb-2 mb-2">
        {currentUser?.StripeBankId  && <NavItem {...props} router={SERVICES} name="Services" Icon={RunmanIcon} />}
        <NavItem {...props} router={BOOKINGS} name="Bookings" Icon={CartIcon} />
        <NavItem {...props} router={AVAILABILITY} name="Availability" Icon={AvailabilityIcon} />
        <NavItem {...props} router={BANK} name="Bank" Icon={CardIcon} />
        <NavItem {...props} router={PROFILE_MENU} name="Profile" Icon={ProfileIcon} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: -3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.22,
    elevation: 8,
  },
});

export default NavBar;
