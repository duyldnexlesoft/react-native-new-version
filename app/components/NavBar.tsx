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

const NavItem = ({focused, navigation, router, name, Icon}: any) => (
  <Pressable className="flex-1 items-center" onPress={() => navigation.navigate(router)}>
    <Icon className={focused === router ? 'text-secondary' : 'text-brown'} height={24} />
    <Text className={`text-xs pt-2 ${focused === router ? 'text-secondary' : 'text-brown'}`}>{name}</Text>
  </Pressable>
);

const NavBar = (props: any) => {
  const {currentUser} = useSelector(userSelector);
  return (
    <View className="w-full rounded-t-[20px] bg-white border border-white pt-4" style={styles.shadowBox}>
      <SafeAreaView className="flex-row justify-between pb-2 mb-2">
        {/* {currentUser?.StripeBankId  && <NavItem {...props} router={ROUTER.SERVICES} name="Services" Icon={RunmanIcon} />}
        <NavItem {...props} router={ROUTER.BOOKINGS} name="Bookings" Icon={CartIcon} />
        <NavItem {...props} router={ROUTER.AVAILABILITY} name="Availability" Icon={AvailabilityIcon} />
        <NavItem {...props} router={ROUTER.BANK} name="Bank" Icon={CardIcon} />
        <NavItem {...props} router={ROUTER.PROFILE} name="Profile" Icon={ProfileIcon} /> */}
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
