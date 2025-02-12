/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import Checkbox from 'app/components/CheckBox';
import _ from 'lodash';
import {useMutation, useQuery} from 'react-query';
import {createAcceptance, render} from 'app/api/toughclicksApi';
// import DeviceInfo from 'react-native-device-info';
import Text from './Text';

const ToughClick = ({argee, setAgree, data}: any) => {
  const [toughclick, setToughclick]: any = useState(false);
  useQuery({queryKey: 'toughclicksRender', queryFn: render, onSuccess: (response: any) => setToughclick(response.data)});
  const muAcceptance = useMutation('createAcceptance', {mutationFn: createAcceptance});

  useEffect(() => {
    if (data) {
      // const model = DeviceInfo.getModel();
      const documents = toughclick.documents.map((document: any) => ({checked: true, checkedAt: new Date(), documentId: document.id}));
      // muAcceptance.mutate({...data, model, documents});
    }
  }, [data]);

  return (
    <>
      <Checkbox status={argee} onPress={() => setAgree(!argee)} />
      <Text className="flex-1 ml-2">
        <Text>{toughclick?.customLabelStart}</Text>
        {_.orderBy(toughclick?.documents, 'order').map((document: any, index: any) => {
          return (
            <Text key={`key_a_${index + 1}`}>
              <Text
                className="color-secondary"
                onPress={() => {
                  Linking.openURL(document.documentUrl);
                }}>
                {document?.displayName}
              </Text>
              <Text>{_.size(toughclick?.documents) - 1 === index ? '' : _.size(toughclick?.documents) - 2 === index ? ' and ' : ', '}</Text>
            </Text>
          );
        })}
      </Text>
    </>
  );
};

export default ToughClick;
