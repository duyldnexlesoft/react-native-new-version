/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {handleBoxImage, handleImageLibrary} from 'app/utils/helpler';
import BoxImage from './BoxImage';
import {cloneDeep, filter, find, isEqual, map, max, min, size} from 'lodash';
import {useTranslation} from 'react-i18next';
const {width} = Dimensions.get('screen');

const EditGallery = (props: any) => {
  const {onChange, maxSize, ratio = 1} = props;
  const {t} = useTranslation();
  const [images, setImages] = useState([]);
  const sizeImage = maxSize ? min([maxSize, max([size(props.images), 6])]) : max([size(props.images), 6]);
  const [boxImages, setBoxImages] = useState(map(Array(sizeImage), (_: any, i: any) => handleBoxImage(width, ratio, i)));

  const handleChoosePhoto = async () => {
    const files: any = await handleImageLibrary(t);
    if (size(files) === 0) return;
    const newUri = onChange ? await onChange({addImage: files[0]}) : files[0].uri;
    let newBoxImages: any = cloneDeep(boxImages);
    const sizeImages = size(filter(newBoxImages, 'url'));
    const boxImage: any = newBoxImages.find((img: any) => img.index === sizeImages && img.size);
    boxImage.url = newUri;
    if (sizeImages >= 5) newBoxImages.push(handleBoxImage(width, ratio, size(images)));
    setBoxImages(newBoxImages);
  };

  useEffect(() => {
    if (!isEqual(props.images, images)) {
      let newBoxImages: any = cloneDeep(boxImages);
      props.images?.forEach((img: any, index: any) => {
        const boxImage = find(newBoxImages, img => index === img.index && img.size > 0);
        if (boxImage) boxImage.url = img;
      });
      const sizeImages = size(filter(newBoxImages, 'url'));
      if (sizeImages >= 6 && (!maxSize || sizeImages < maxSize)) newBoxImages.push(handleBoxImage(width, ratio, size(props.images)));
      setBoxImages(newBoxImages);
      setImages(props.images);
    }
  }, [props.images]);

  return (
    <View className="m-4 z-[3]" {...props} style={{height: max(map(boxImages, img => img.pointX))}}>
      {boxImages.map((image: any, i: any) => (
        <BoxImage key={`key-${i + 1}`} {...{image, setBoxImages, onChange, boxImages, handleChoosePhoto, ratio}} />
      ))}
    </View>
  );
};
export default EditGallery;
