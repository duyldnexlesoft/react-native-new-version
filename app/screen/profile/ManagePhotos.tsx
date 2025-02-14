/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Add18Icon from 'assets/svg/add18.svg';
import {cloneDeep, concat, filter, size} from 'lodash';
import {useTranslation} from 'react-i18next';
import EditGallery from 'app/components/gallerry/EditGallery';
import {useMutation} from 'react-query';
import {deleteImage, uploadImage, changeImageIndex} from 'app/api/userApi';
import {createFormData, handleImageLibrary} from 'app/utils/helpler';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from 'app/store/selectors';
import {userAction} from 'app/store/actions';
import GrayLayout from 'app/layout/GrayLayout';
import Alert from 'app/components/Alert';

const ManagePhotos = (props: any) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {currentUser} = useSelector(userSelector);
  const [images, setImages]: any = useState(currentUser.Images || []);

  useEffect(() => {
    const payload: any = {Images: images};
    dispatch(userAction.updateCurrentUser(payload));
  }, [images]);

  const muUploadImage = useMutation('uploadImage', {
    mutationFn: uploadImage,
    onSuccess: ({data}: any) => {
      if (data?.code === 200) {
        setImages(concat(images, data?.data));
      } else {
        Alert.alert(data.message);
      }
    },
    onError: (error: any) => Alert.alert(error.message),
  });

  const muDeleteImage = useMutation('deleteImage', {
    mutationFn: deleteImage,
    onSuccess: ({data}, variables) => {
      if (data?.code === 200) {
        setImages(filter(images, img => img !== variables.image));
      } else {
        Alert.alert(data.message);
      }
    },
    onError: (error: any) => Alert.alert(error.message),
  });

  const muChangeImageIndex = useMutation('changeImageIndex', {
    mutationFn: changeImageIndex,
    onSuccess: ({data}, variables) => {
      if (data?.code === 200) {
        setImages(variables.images);
      } else {
        Alert.alert(data.message);
      }
    },
    onError: (error: any) => Alert.alert(error.message),
  });

  const handleChoosePhoto = async () => {
    const files: any = await handleImageLibrary(t);
    if (size(files) === 0) return;
    muUploadImage.mutate(createFormData(files[0]));
  };

  const onChangeImage = async (payload: any) => {
    if (payload.addImage !== undefined) {
      muUploadImage.mutate(createFormData(payload.addImage));
    } else if (payload.delIndex !== undefined) {
      muDeleteImage.mutate({image: currentUser.Images[payload.delIndex]});
    } else if (payload.changeIndex !== undefined) {
      const [form, to] = payload.changeIndex;
      const newImages = cloneDeep(images);
      newImages[form] = images[to];
      newImages[to] = images[form];
      muChangeImageIndex.mutate({images: newImages});
    }
  };

  return (
    <GrayLayout {...props} isLoading={muUploadImage.isLoading} renderRight={() => (
      <TouchableOpacity className="w-9 h-9 items-center justify-center" onPress={handleChoosePhoto}>
        <Add18Icon width={23} height={23} className="text-secondary" />
      </TouchableOpacity>
    )}>
      <EditGallery ratio={1} images={images} onChange={onChangeImage} />
    </GrayLayout>
  );
};

export default ManagePhotos;
