import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {find, isEmpty} from 'lodash';
import StartSvg from 'assets/svg/star.svg';
import StartOutlineSvg from 'assets/svg/star-outline.svg';
import TextInput from '../TextInput';
import {REVIEW_TYPE} from 'app/utils/constants';
import {formatTimeRequest, getFullName} from 'app/utils/helpler';
import Text from '../Text';
import {useTranslation} from 'react-i18next';
import Modal from './Modal';
import ButtonGreen from '../button/ButtonGreen';
import ButtonOveline from '../button/ButtonOveline';
import {useMutation, useQueryClient} from 'react-query';
import {createReview} from 'app/api/reviewApi';
import {bookingAction} from 'app/store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {bookingSelector} from 'app/store/selectors';
import Avatar from '../Avatar';

const ReviewModal = (props: any) => {
  const {modal, setModal} = props;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {booking} = useSelector(bookingSelector);
  const queryClient = useQueryClient();
  const {VerifiedUser, Reviews, User} = booking || {};
  const sherpaReview = find(Reviews, r => r.Type === REVIEW_TYPE.SHERPA);
  const athleteReview = find(Reviews, r => r.Type === REVIEW_TYPE.ATHLETE);
  const [Rating, setRating] = useState(athleteReview?.Rating || 0);
  const [Comment, setComment] = useState(athleteReview?.Comment || '');

  const mucCreateReview = useMutation('createReview', {
    mutationFn: createReview,
    onSuccess: (response: any) => {
      if (response?.data?.code === 201) {
        dispatch(bookingAction.setBooking({...booking, Reviews: [...booking?.Reviews, response?.data?.data]}));
        queryClient.invalidateQueries('getBookings');
        setRating(0);
        setComment('');
        setModal(false);
      }
    },
    onError: () => {},
  });

  const handleRating = (value: number) => {
    if (!sherpaReview) setRating(value);
  };

  const handleReview = (Rating: any, Comment: any) => {
    if (Rating > 0) {
      const UserId = User._id;
      const VerifiedUserId = VerifiedUser._id;
      mucCreateReview.mutate({UserId, VerifiedUserId, UserOrderId: booking?._id, Rating, Comment});
    }
  };

  return (
    <Modal animationType="slide" {...props} className="items-center justify-end">
      <SafeAreaView className="w-full z-10 bg-white rounded-t-[15px] overflow-hidden">
        <View className="p-4 items-center">
          <View className="w-16 h-2 bg-[#F9F5F5] mb-1.5 rounded-full" />
          <Text className="text-center text-lg font-medium text-textContainer mb-6">{t('review')}</Text>
          {!sherpaReview && (
            <View className="w-full items-center">
              <Avatar className="w-16 h-16" image={User?.Images?.[0]} type="rounded" />
              <Text className="text-center text-base font-medium text-textContainer mt-2">
                {User?.FirstName} {User?.LastName}
              </Text>
              <View className="flex-row my-6">
                {[1, 2, 3, 4, 5].map((r, index) => (
                  <Pressable className="px-2" onPress={() => handleRating(r)} key={`sta-${index}`}>
                    {Rating < r ? <StartOutlineSvg width={36} height={36} /> : <StartSvg width={36} height={36} />}
                  </Pressable>
                ))}
              </View>
              <TextInput
                label="Your comment"
                name="TrainingGoals"
                multiline={true}
                numberOfLines={10}
                height={100}
                value={Comment}
                onChange={event => setComment(event.nativeEvent.text)}
              />
              <View className="w-full pt-6 flex-row justify-between">
                <View className="flex-1 basis-1/2 pr-2">
                  <ButtonOveline onPress={() => setModal(!modal)}>{t('cancel')}</ButtonOveline>
                </View>
                <View className="flex-1 basis-1/2 pl-2">
                  <ButtonGreen onPress={() => handleReview(Rating, Comment)} disabled={mucCreateReview.isLoading}>
                    {t('Save')}
                  </ButtonGreen>
                </View>
              </View>
            </View>
          )}
          {sherpaReview && (
            <View className="w-full">
              <View className="border border-border w-full rounded-[10px] mb-4">
                <View className="p-3 bg-bgScreen rounded-t-[10px]">
                  <Text className="font-medium text-secondary">{t('reviewOfSherpa')}</Text>
                </View>
                <View className="w-full p-3">
                  <View className="w-full flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Avatar className="w-9 h-9" image={VerifiedUser?.Images?.[0]} type="rounded" />
                      <View className="pl-3">
                        <Text className="text-black font-medium text-base">{getFullName(VerifiedUser)}</Text>
                        <Text className="text-brown text-xs">{formatTimeRequest(sherpaReview.createdAt)}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center rounded-md border border-bgLightGray bg-bgScreen px-2 py-1">
                      <StartSvg width={13} />
                      <Text className="pl-1 text-darkBrown">{sherpaReview.Rating}.0</Text>
                    </View>
                  </View>
                  <Text className="text-black">{sherpaReview.Comment}</Text>
                </View>
              </View>
              {athleteReview && (
                <View className="border border-border w-full rounded-[10px]">
                  <View className="flex-row items-center p-3 bg-bgScreen rounded-t-[10px]">
                    <Text className="font-medium text-darkRed">{t('reviewOfAthlete')}</Text>
                  </View>
                  <View className="w-full p-3">
                    <View className="w-full flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <Avatar className="w-9 h-9" image={User?.Images?.[0]} type="rounded" />
                        <View className="pl-3">
                          <Text className="text-textContainer font-medium text-base">{getFullName(User)}</Text>
                          <Text className="text-brown text-xs">{formatTimeRequest(athleteReview.createdAt)}</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center rounded-md border border-bgLightGray bg-bgScreen px-2 py-1">
                        <StartSvg width={13} />
                        <Text className="pl-1 text-darkBrown">{athleteReview.Rating}.0</Text>
                      </View>
                    </View>
                    <Text className="text-black">{athleteReview.Comment}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.2,
    elevation: 3,
  },
});
export default ReviewModal;
