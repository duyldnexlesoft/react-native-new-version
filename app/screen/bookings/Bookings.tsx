/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import Text from 'app/components/Text';
import CartIcon from 'assets/svg/cart.svg';
import StarIcon from 'assets/svg/star.svg';
import ImageIcon from 'assets/svg/image.svg';
import BlueLayout from 'app/layout/BlueLayout';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery, useQueryClient} from 'react-query';
import {BOOKING_TABS, LIMIT_ITEM, STATUS} from 'app/utils/constants';
import {userSelector} from 'app/store/selectors';
import {getBookings} from 'app/api/bookingApi';
import {concat, isEmpty, size} from 'lodash';
import {getReviewSherpa, getStatus} from 'app/utils/helpler';
import moment from 'moment';
import Image from 'app/components/Image';
import LabelStatus from 'app/components/LabelStatus';
import AnimatedLoading from 'app/components/Animated/AnimatedLoading';
// import ROUTER from 'app/navigation/router';
import ReviewModal from 'app/components/Modal/ReviewModal';
import {bookingAction} from 'app/store/actions';
import Avatar from 'app/components/Avatar';
import NavBar from 'app/components/NavBar';

const Bookings = (props: any) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [reviewModal, setReviewModal]: any = useState(false);
  const {REQUESTED, REJECTED, ACCEPTED, CONFIRMED, COMPLETED, CANCELED, REFUNDED, EXPIRED} = STATUS;
  const [tab, setTab] = useState(BOOKING_TABS.UPCOMING);
  const [bookings, setBookings]: any = useState(null);
  const [totalOrder, setTotalOrder]: any = useState(0);
  const [skip, setSkip]: any = useState(0);
  const {currentUser} = useSelector(userSelector);
  useEffect(() => {
    handleQueryData(tab, skip);
  }, []);

  const handleRequestData = () => {
    let status = null;
    let isSherpaReview = null;
    const verifiedUserId = currentUser._id;
    if (tab === BOOKING_TABS.UPCOMING) {
      isSherpaReview = '0';
      status = [REQUESTED, ACCEPTED, CONFIRMED].join(',');
    } else if (tab === BOOKING_TABS.REVIEW) {
      isSherpaReview = '0';
      status = COMPLETED;
    } else if (tab === BOOKING_TABS.PAST) {
      isSherpaReview = '1';
      status = [COMPLETED, CANCELED, REFUNDED, REJECTED, EXPIRED].join(',');
    }
    return getBookings({limit: LIMIT_ITEM, skip, status, isSherpaReview, verifiedUserId, sortBy: 'StartTime', sortOrder: 'desc'});
  };

  const {isLoading} = useQuery(['getBookings', currentUser._id, tab, skip], () => handleRequestData(), {
    onSuccess: () => handleQueryData(tab, skip),
    staleTime: Infinity,
  });

  const handleQueryData = (tab: any, skip: any) => {
    const data: any = queryClient.getQueryData(['getBookings', currentUser._id, tab, skip]);
    setSkip(skip);
    setTab(tab);
    if (data?.data?.data) {
      setBookings(concat(skip ? bookings : [], data?.data?.data?.edges || []));
      setTotalOrder(data?.data?.data?.pageInfo?.[0]?.count || 0);
    }
  };

  const onRefresh = () => {
    setSkip(0);
    setTimeout(() => queryClient.invalidateQueries('getBookings'));
  };

  const handleScroll = (event: any) => {
    const {contentSize, contentOffset, layoutMeasurement} = event.nativeEvent;
    const checkScroll = contentOffset.y > 0 && layoutMeasurement.height / (contentSize.height - contentOffset.y) > 0.6;
    if (checkScroll && !isLoading && totalOrder > size(bookings)) {
      handleQueryData(tab, skip + LIMIT_ITEM);
    }
  };

  const handleViewBooking = (booking: any) => {
    dispatch(bookingAction.setBooking(booking));
    // props.navigation.navigate(ROUTER.BOOKING_DEAIL);
  };

  const handleViewAthlete = (booking: any) => {
    dispatch(bookingAction.setBooking(booking));
    // props.navigation.navigate(ROUTER.ATHLETE_DETAIL, {user: booking.User});
  };

  return (
    <BlueLayout {...props}>
      <View className="flex-1">
        <View className="border-b border-border mb-3 mt-3">
          <View className="flex-row w-full">
            {Object.values(BOOKING_TABS).map((tabName: any, index: any) => {
              const cssPres = tab === tabName ? 'border-secondary border-b-4' : 'border-white';
              const cssText = tab === tabName ? 'text-secondary font-medium' : 'text-textContainer';
              return (
                <Pressable
                  key={`tab-${index}`}
                  className={cssPres + ' basis-1/3 items-center pt-2 m-[-1px] pb-3'}
                  onPress={() => {
                    setBookings([]);
                    handleQueryData(tabName, 0);
                  }}>
                  <Text className={cssText + ' '}>{tabName}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {bookings !== null && isEmpty(bookings) && !isLoading && (
          <View className="items-center justify-center h-[50%] p-8">
            <CartIcon className="text-brown" width={60} height={60} />
            <Text className="text-xl font-bold text-brown pt-6">{t('noBookings', {tab})}</Text>
            <Text className="text-base text-center text-brown mt-1">{t('emptyBookingDescription')}</Text>
          </View>
        )}
        <ScrollView
          className="px-4 py-1"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
          <View className="w-full">
            {bookings?.map((booking: any, index: any) => {
              const {User, Service, Messages} = booking;
              const Review = getReviewSherpa(booking);
              let status = getStatus(booking);
              return (
                <Pressable
                  pointerEvents="box-none"
                  className="flex-1 bg-white rounded-[10px] mb-3 border border-border"
                  key={`booking-${index + 1}`}
                  style={styles.shadowBox}
                  onPress={() => handleViewBooking(booking)}>
                  <View className="flex-1 p-2.5 flex-row rounded-t-[10px] items-center justify-between bg-bgLightGray">
                    <View className="w-[62px] h-[40px] mr-2.5 rounded overflow-hidden bg-bgScreen items-center justify-center">
                      {Service?.Images?.[0] && <Image uri={Service?.Images?.[0]} className="w-[62px] h-[40px]" />}
                      {!Service?.Images?.[0] && <ImageIcon className="text-brown" width={22} height={22} />}
                    </View>
                    <View className="flex-1">
                      <View className="">
                        <Text className="font-medium text-base text-black">{Service.Name}</Text>
                        <View className="flex-row items-center">
                          {Service.DefaultAmountTime && <Text className="text-xs text-black">{t('defaulDuration')}: </Text>}
                          {Service.DefaultAmountTime && <Text className="text-xs text-black font-bold">{Service.DefaultAmountTime}</Text>}
                        </View>
                      </View>
                    </View>
                    <Pressable className="w-9 h-9 relative" onPress={() => handleViewAthlete(booking)}>
                      <Avatar className="w-9 h-9" image={User?.Images?.[0]} type="rounded" />
                      {!isEmpty(Messages) && (
                        <View className="bg-red-600 h-[18px] min-w-[18px] items-center justify-center absolute top-[-2px] right-[-2px] rounded-full px-1.5">
                          <Text className="text-white text-[10px] font-bold">
                            {size(Messages) > 5 ? 5 : size(Messages)}
                            {size(Messages) > 5 ? '+' : ''}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                  <View className="flex-row items-center justify-between p-2.5 border-b border-border">
                    <Text>{t('Request Time')}</Text>
                    <Text className="font-medium">{moment(booking.createdAt).format('dddd, ll')}</Text>
                  </View>
                  <View className="flex-row  rounded-b-[10px] items-center justify-between h-[42px] px-2.5">
                    <View className="flex-row items-center">
                      <LabelStatus booking={booking} />
                      {status === COMPLETED && !!Review && (
                        <View className="flex-row items-center h-[22px] bg-bgScreen border border-bgLightGray px-2 ml-2 rounded-sm">
                          <StarIcon width={13} />
                          <Text className="text-xs text-darkBrown pl-1">{Review?.Rating}.0</Text>
                        </View>
                      )}
                      {status === COMPLETED && (
                        <Pressable
                          className="h-[42px] items-center justify-center px-4"
                          onPress={() => {
                            dispatch(bookingAction.setBooking(booking));
                            setReviewModal(true);
                          }}>
                          <Text className="text-xs text-secondary">{t(!!Review ? 'seeReview' : 'reviewNow')}</Text>
                        </Pressable>
                      )}
                    </View>
                    <Text className="text-base font-bold text-red-500">${(booking.TotalAmount / 100).toFixed(2)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        {isLoading && (
          <View className="h-8 items-center justify-center">
            <AnimatedLoading className="bg-secondary" />
          </View>
        )}
      </View>
      {/* <NavBar {...props} focused={ROUTER.BOOKINGS} /> */}
      <ReviewModal {...{modal: reviewModal, setModal: setReviewModal}} />
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
    shadowOpacity: 0.22,
    shadowRadius: 1.22,
    elevation: 2,
  },
});
export default Bookings;
