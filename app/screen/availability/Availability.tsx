/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from 'app/components/Text';
import ColorLayout from 'app/layout/ColorLayout';
import BgHeader from 'assets/svg/bgHeader.svg';
import Add16Icon from 'assets/svg/add16.svg';
import Close22Icon from 'assets/svg/close22.svg';
import AvailabilityIcon from 'assets/svg/availability.svg';
import {useMutation, useQuery} from 'react-query';
import {getAvailability, saveAvailability} from 'app/api/availabilityApi';
import {useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import {useTranslation} from 'react-i18next';
import {DAYS_OF_WEEK} from 'app/utils/constants';
import {cloneDeep, isEmpty, upperCase} from 'lodash';
import ButtonAvailable from 'app/components/button/ButtonAvailable';
import moment from 'moment';
import DayRangeModal from 'app/components/Modal/DayRangeModal';
import NavBar from 'app/components/NavBar';
import { router } from 'expo-router';
// import ROUTER from 'app/navigation/router';
const dimensions = Dimensions.get('screen');

const Availability = (props: any) => {
  const {t} = useTranslation();
  const {currentUser} = useSelector(userSelector);
  const [dateRangeAvaiModal, setDateRangeAvailModal]: any = useState(false);
  const [dateRangeExceModal, setDateRangeExceModal]: any = useState(false);
  const [dateRange, setDateRange]: any = useState({startDate: null, endDate: null});
  const [exceptions, setExceptions]: any = useState([]);
  const [daysOfWeek, setDaysOfWeek]: any = useState(DAYS_OF_WEEK.map(name => ({name, active: false, times: []})));
  const {data} = useQuery(['getAvailability', currentUser._id], () => getAvailability());
  const mucSaveAvailability = useMutation('saveAvailability', {mutationFn: saveAvailability, onError: () => {}});
  const handleSave = ({newDaysOfWeek, newExceptions}: any) => {
    const finalDaysOfWeek = newDaysOfWeek || daysOfWeek;
    const Exceptions = !isEmpty(getDaysActive(finalDaysOfWeek)) ? newExceptions || exceptions : [];
    const FinalAvailable = getFinalAvailable(finalDaysOfWeek, Exceptions);
    mucSaveAvailability.mutate({Available: getDaysActive(finalDaysOfWeek), Exceptions, FinalAvailable});
  };

  useEffect(() => {
    if (data?.data?.data) {
      const {Available, Exceptions} = data?.data?.data;
      const newDaysOfWeek = cloneDeep(daysOfWeek);
      Available.forEach((item: any) => {
        let dayOfWeek = newDaysOfWeek.find((day: any) => day.name === item.name);
        dayOfWeek.times = item.times;
        dayOfWeek.active = item.active;
      });
      setDaysOfWeek(newDaysOfWeek);
      setExceptions(Exceptions);
    }
  }, [data?.data?.data]);

  const getDaysActive = (daysOfWeek: any) => daysOfWeek.filter((day: any) => day.active);

  const pushDay = (day: any) => {
    const newDaysOfWeek = cloneDeep(daysOfWeek);
    const dayOfWeek: any = newDaysOfWeek.find((d: any) => d.name === day.name);
    if (day.active) {
      dayOfWeek.active = !day.active;
      dayOfWeek.times = [];
      setDaysOfWeek(newDaysOfWeek);
      handleSave({newDaysOfWeek});
    } else {
      handleChangeAvai(day);
    }
  };

  const removeAvaiTime = (day: any, index: any) => {
    const newDaysOfWeek = cloneDeep(daysOfWeek);
    const dayOfWeek: any = newDaysOfWeek.find((d: any) => d.name === day.name);
    dayOfWeek.times = dayOfWeek.times.filter((d: any, i: any) => i !== index);
    if (isEmpty(dayOfWeek.times)) dayOfWeek.active = false;
    setDaysOfWeek(newDaysOfWeek);
    handleSave({newDaysOfWeek});
  };

  const removeExceTime = (index: any) => {
    let newExceptions = cloneDeep(exceptions);
    newExceptions = newExceptions.filter((d: any, i: any) => i !== index);
    setExceptions(newExceptions);
    handleSave({newExceptions});
  };

  const renderAvaiTime = (dayNumber: any) => moment().startOf('days').add(dayNumber, 'hour').format('hh:mm A');
  const renderExceTime = (day: any) => moment(day).format('MMM DD, hh:mm A');

  const changeExceTime = ({startDate, endDate}: any) => {
    let newExceptions = cloneDeep(exceptions);
    if (dateRange.index === undefined) {
      newExceptions.push({startTime: moment(startDate), endTime: moment(endDate)});
    } else {
      const exception: any = newExceptions.find((d: any, i: any) => i === dateRange.index);
      exception.startTime = startDate;
      exception.endTime = endDate;
    }
    setExceptions(newExceptions);
    setDateRangeExceModal(false);
    handleSave({newExceptions});
  };

  const changeAvaiTime = ({startDate, endDate}: any) => {
    const newDaysOfWeek = cloneDeep(daysOfWeek);
    const dayOfWeek: any = newDaysOfWeek.find((d: any) => d.name === dateRange.name);
    const startTime = moment(startDate).hours() + moment(startDate).minutes() / 60;
    const endTime = moment(endDate).hours() + moment(endDate).minutes() / 60;

    if (dateRange.index === undefined) {
      dayOfWeek.times.push({startTime, endTime});
      dayOfWeek.active = true;
    } else {
      const time: any = dayOfWeek.times.find((t: any, i: any) => i === dateRange.index);
      time.startTime = startTime;
      time.endTime = endTime;
    }
    setDaysOfWeek(newDaysOfWeek);
    setDateRangeAvailModal(false);
    handleSave({newDaysOfWeek});
  };

  const getFinalAvailable = (daysOfWeek: any, exceptions: any) => {
    const finalAvailable: any = [];
    const format = (date: any) => moment(date).format('YYYY-MM-DD');
    const addAndFormat = (date: any) => moment(date).add(1, 'days').utc().format();
    const startAndFormat = (date: any) => moment(date).startOf('days').utc().format();
    const endAndFormat = (date: any) => moment(date).endOf('days').utc().format();
    const hours = (date: any) => moment(date).hours();
    const minutes = (date: any) => moment(date).minutes();
    exceptions.forEach((exception: any) => {
      for (let date: any = exception.startTime; format(date) <= format(exception.endTime); date = addAndFormat(date)) {
        const startDate = date === exception.startTime ? date : startAndFormat(date);
        const endDate = format(date) === format(exception.endTime) ? exception.endTime : endAndFormat(date);
        const name = upperCase(moment(startDate).format('dd'));

        const available = getDaysActive(daysOfWeek).find((item: any) => item.name === name);
        const filterFinalAvailable = finalAvailable.filter((item: any) => item.name === name && item.date === format(date));

        const start = hours(startDate) + minutes(startDate) / 60;
        const end = hours(endDate) + minutes(endDate) / 60;

        if (!isEmpty(filterFinalAvailable)) {
          filterFinalAvailable.forEach((item: any) => {
            const {startTime, endTime} = item;
            if (startTime < start && endTime > start) {
              item.endTime = start;
            } else if (startTime < end && endTime > end) {
              item.startTime = end;
            } else if (start <= startTime && end >= endTime) {
              item.startTime = 0;
              item.endTime = 0;
            }
          });
        } else {
          available?.times.forEach(({startTime, endTime}: any) => {
            if (startTime < start && endTime > start) {
              finalAvailable.push({date: format(date), name, startTime, endTime: start});
            } else if (startTime < end && endTime > end) {
              finalAvailable.push({date: format(date), name, startTime: end, endTime});
            } else if (start <= startTime && end >= endTime) {
              finalAvailable.push({date: format(date), name, startTime: 0, endTime: 0});
            }
          });
        }
      }
    });
    return finalAvailable;
  };

  const handleChangeAvai = (day: any, time?: any, index?: any) => {
    if (index !== undefined) {
      const startDate = moment().startOf('days').add(time.startTime, 'hour').toDate();
      const endDate = moment().startOf('days').add(time.endTime, 'hour').toDate();
      setDateRangeAvailModal(true);
      setDateRange({name: day.name, index, startDate, endDate});
    } else {
      const startDate = moment().startOf('days').toDate();
      setDateRangeAvailModal(true);
      setDateRange({name: day.name, startDate, endDate: null});
    }
  };

  const handleChangeExce = (exception?: any, index?: any) => {
    if (index !== undefined) {
      setDateRangeExceModal(true);
      setDateRange({index, startDate: new Date(exception.startTime), endDate: new Date(exception.endTime)});
    } else {
      setDateRangeExceModal(true);
      setDateRange({startDate: moment().startOf('dates').toDate(), endDate: null});
    }
  };

  return (
    <ColorLayout>
      <View className="absolute w-full top-[-1px]">
        <BgHeader width={dimensions.width} height={(195 * dimensions.width) / 375} />
      </View>
      <SafeAreaView className="flex-1">
        <Text className="text-white font-medium text-lg	uppercase text-center mb-2">{t('avaAndExcep')}</Text>
        <View className="items-center mt-0.5">
          <View className="bg-trans50Pri rounded-[40px] px-4 py-0.5">
            <Text className="text-white text-lg	uppercase">{t('availability')}</Text>
          </View>
        </View>
        <View className="flex-row justify-center my-4">
          {daysOfWeek.map((day: any, index: any) => (
            <ButtonAvailable {...day} className="mx-1 w-10 h-10" onPress={() => pushDay(day)} key={`day-${index + 1}`} />
          ))}
        </View>
        {isEmpty(getDaysActive(daysOfWeek)) && (
          <View className="items-center bg-bgScreen justify-center h-[70%]">
            <AvailabilityIcon className="text-brown mb-4" width={54} height={54} />
            <Text className="text-xl font-bold text-brown">{t('availabilityEmpty')}</Text>
            <Text className="text-base text-brown">{t('availabilityEmptyDesc')}</Text>
          </View>
        )}
        <ScrollView className="h-full">
          <View className="px-4 bg-bgScreen h-full">
            {getDaysActive(daysOfWeek).map((day: any, index: any) => (
              <View className="flex-row p-4 bg-bgLightGray rounded-[10px] mb-4" key={`day-${index + 1}`}>
                <View>
                  <ButtonAvailable {...day} className="w-11 h-11 text-base" />
                  <TouchableOpacity
                    className="w-11 h-11 rounded-full bg-white items-center justify-center mt-4"
                    style={[styles.shadowAdd]}
                    onPress={() => handleChangeAvai(day)}>
                    <Add16Icon className="text-black" />
                  </TouchableOpacity>
                </View>
                <View className="pl-4 gap-y-4 flex-col flex-1">
                  {day.times.map((time: any, index: any) => (
                    <View
                      className="bg-white rounded-[10px] h-11 w-full flex-row items-center justify-between"
                      style={[styles.shadowBox]}
                      key={`day-${index + 1}-time-${index + 1}`}>
                      <Pressable className="flex-row pl-4 flex-1 h-full items-center" onPress={() => handleChangeAvai(day, time, index)}>
                        <Text className="text-black">{renderAvaiTime(time.startTime)}</Text>
                        <Text className="px-2.5 text-darkBrown">to</Text>
                        <Text className="text-black">{renderAvaiTime(time.endTime)}</Text>
                      </Pressable>
                      <TouchableOpacity className="p-4" onPress={() => removeAvaiTime(day, index)}>
                        <Close22Icon width={14} className="text-black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            {!isEmpty(getDaysActive(daysOfWeek)) && (
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-medium uppercase">{t('exceptions')}</Text>
                <TouchableOpacity
                  className="w-11 h-11 rounded-full bg-white items-center justify-center"
                  style={[styles.shadowAdd]}
                  onPress={() => handleChangeExce()}>
                  <Add16Icon className="text-black" />
                </TouchableOpacity>
              </View>
            )}

            {!isEmpty(getDaysActive(daysOfWeek)) &&
              exceptions.map((exception: any, index: any) => (
                <View
                  className="bg-white rounded-[10px] h-11 w-full flex-row items-center justify-between mb-4"
                  style={[styles.shadowBox]}
                  key={`exr-${index + 1}`}>
                  <Pressable className="flex-row pl-4 flex-1 h-full items-center" onPress={() => handleChangeExce(exception, index)}>
                    <Text className="text-black">{renderExceTime(exception.startTime)}</Text>
                    <Text className="px-2.5 text-darkBrown">to</Text>
                    <Text className="text-black">{renderExceTime(exception.endTime)}</Text>
                  </Pressable>
                  <TouchableOpacity className="p-4" onPress={() => removeExceTime(index)}>
                    <Close22Icon width={14} className="text-black" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <NavBar {...props} />
      <DayRangeModal
        dateRange={dateRange}
        onConfirm={changeAvaiTime}
        modal={dateRangeAvaiModal}
        setModal={setDateRangeAvailModal}
        delayTime="01:00"
        mode="time"
      />
      <DayRangeModal
        dateRange={dateRange}
        onConfirm={changeExceTime}
        modal={dateRangeExceModal}
        setModal={setDateRangeExceModal}
        delayTime="01:00"
        mode="datetime"
      />
    </ColorLayout>
  );
};

const styles = StyleSheet.create({
  shadowAdd: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.13,
    shadowRadius: 2.32,
    elevation: 3,
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.13,
    shadowRadius: 2.32,
    elevation: 2,
  },
});
export default Availability;
