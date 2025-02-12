import React, {useEffect, useState} from 'react';
import {useQuery} from 'react-query';
// import RNFS from 'react-native-fs';
import {ImageProps, Platform} from 'react-native';
import {last, split} from 'lodash';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

export interface ImageCustomProps extends ImageProps {
  width?: number;
  height?: number;
  source?: any;
  uri?: string;
  animated?: boolean;
}

const Image = (props: ImageCustomProps) => {
  const [cacheImage, setCacheImage]: any = useState(props.uri);
  const openity = useSharedValue(0);
  const styleTransOp = useAnimatedStyle(() => ({opacity: openity.value}));
  const {data, isLoading} = useQuery(['getImages', props.uri], () => handleGetImages(props?.uri), {staleTime: Infinity});
  const handleGetImages = async (uri: any) => {
    let filePath: any = null;
    if (!props.source && props.uri) {
      // filePath = `${Platform.OS === 'ios' ? '' : 'file://'}${RNFS.CachesDirectoryPath}/${getFileName(uri)}`;
      // const response = await RNFS.exists(filePath);
      // if (!response) {
      //   const downloadOptions = {fromUrl: uri, toFile: filePath};
      //   await RNFS.downloadFile(downloadOptions).promise;
      // }
    }
    return filePath;
  };
  const getFileName = (uri: string) => last(split(uri, '/'));

  useEffect(() => {
    if (!isLoading && data) {
      setCacheImage(data);
      setTimeout(() => {
        openity.value = withTiming(1, {duration: 500});
      });
    }
  }, [data]);

  return <Animated.Image style={[props.style, styleTransOp]} source={props.source || {uri: cacheImage}} />;
};

export default Image;
