/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Platform, Pressable, SafeAreaView, ScrollView, StatusBar, TextInput, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {geocoding} from 'app/api/mapboxApi';
import LocationIcon from 'assets/svg/location-outline.svg';
import SearchIcon from 'assets/svg/search.svg';
import ArrowLeftIcon from 'assets/svg/arrow-left.svg';
import ClearIcon from 'assets/svg/clear.svg';
import Text from '../Text';
import _ from 'lodash';
import Modal from './Modal';

const LocationModal = (props: any) => {
  const {location, modal, setModal, handleSelect} = props;
  const [locationValue, setLocationValue]: any = useState(location ? location.place_name : '');
  const [searchValue, setSearchValue]: any = useState(location ? location.place_name : '');
  const statusBarHeight = Platform.OS === 'android' ? Number(StatusBar.currentHeight || 0) + 10 : 0;

  const handlegGeocoding = () => (searchValue ? geocoding(searchValue, 10, 'US') : null);
  const {data: dataGeocoding, isLoading} = useQuery(['geocoding', searchValue], () => handlegGeocoding(), {staleTime: Infinity});

  useEffect(() => {
    if (!isLoading) setSearchValue(locationValue);
  }, [isLoading]);

  const handleOnChange = (event: any) => {
    setLocationValue(event.nativeEvent.text);
    if (!isLoading) {
      setSearchValue(event.nativeEvent.text);
    }
  };

  const renderText = (text: string) => {
    const form = _.lowerCase(text).indexOf(_.lowerCase(searchValue));
    const to = form + searchValue.length;
    if (form === -1) {
      return <Text className="text-darkBrown flex-1 pr-2">{text}</Text>;
    } else {
      return (
        <Text className="text-darkBrown flex-1 pr-2">
          <Text className="text-black">{text.substring(form, to)}</Text>
          {text.substring(to)}
        </Text>
      );
    }
  };

  return (
    <Modal animationType="fade" {...props}>
      <SafeAreaView className="bg-bgScreen w-full h-full">
        <View className="p-4" style={{paddingTop: statusBarHeight}}>
          <View className="bg-bgLightGray w-full rounded flex-row items-center justify-between">
            <TouchableOpacity className="px-2 h-12 flex justify-center items-center" onPress={() => setModal(!modal)}>
              <ArrowLeftIcon className="text-textContainer ml-2" height={18} width={14} />
            </TouchableOpacity>
            <TextInput
              onLayout={event => event.currentTarget.focus()}
              placeholder="Search"
              className="px-1 h-12 flex-1"
              value={searchValue}
              onChange={handleOnChange}
            />
            <Pressable className="p-4 h-12 flex justify-center items-center" onPress={() => setSearchValue('')}>
              {!searchValue ? <SearchIcon className="text-secondary" /> : <ClearIcon />}
            </Pressable>
          </View>
          <ScrollView className="bg-bgScreen h-full mb-20">
            {(searchValue ? dataGeocoding?.data?.features : [])?.map((feature: any, index: any) => {
              return (
                <Pressable
                  key={`key-l-${index + 1}`}
                  className="border-b flex-row border-border items-center py-3"
                  onPress={() => {
                    setModal(false);
                    handleSelect(feature);
                  }}>
                  <View className="w-8 h-8 bg-bgLightGray rounded-full items-center justify-center mr-3">
                    <LocationIcon className="text-secondary" width={16} height={16} />
                  </View>
                  {renderText(feature.place_name)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LocationModal;
