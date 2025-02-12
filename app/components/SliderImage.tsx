import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {FlatList, View} from 'react-native';
import ImageIcon from 'assets/svg/image.svg';
import _, {isString} from 'lodash';
import Image from './Image';
const {width} = Dimensions.get('screen');

const SliderImage = ({height, Images}: any) => {
  const [indexImage, setIndexImage] = useState(0);
  const handleScroll = (event: any) => {
    const index = event.nativeEvent.contentOffset.x / width;
    setIndexImage(Number(index.toFixed(0)));
  };

  return (
    <View className="relative w-full">
      {!_.isEmpty(Images) ? (
        <>
          <FlatList
            data={Images.map((item: any) => (isString(item) ? {url: item} : {render: item}))}
            renderItem={({item}) => {
              if (item.render) {
                return <View style={{height, width}}>{item.render()}</View>;
              } else {
                return <SliderItem item={item} height={height} />;
              }
            }}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
          />
          <View className="absolute w-full" style={{bottom: 56}}>
            {_.size(Images) > 1 && <Pagination indexImage={indexImage} images={Images} />}
          </View>
        </>
      ) : (
        <View className="items-center justify-center w-full" style={{height, width}}>
          <ImageIcon className="text-lightGray" width={100} height={100} />
        </View>
      )}
    </View>
  );
};

const SliderItem = ({item, height}: any) => {
  return (
    <View className="items-center" style={{width, height}}>
      <Image uri={item.url} className="w-full flex-[1]" />
    </View>
  );
};
const Pagination = ({indexImage, images}: any) => {
  return (
    <View className="flex-row items-center justify-center">
      {images?.map((_s: any, i: any) => (
        <View key={`key-pag-${i + 1}`} className={`${indexImage === i ? 'bg-secondary' : 'bg-white'} w-3 h-3 rounded-full mx-1.5`} />
      ))}
    </View>
  );
};
export default SliderImage;
