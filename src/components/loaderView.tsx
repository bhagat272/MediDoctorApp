import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Colors from '../theme/colors';
import {Fold} from 'react-native-animated-spinkit';
import {useSelector} from 'react-redux';
const LoaderView = (props: any) => {
  const {show} = useSelector((state: any) => state.loading);

  return show ? (
    <>
      {Platform.OS == 'ios' ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <Fold color={Colors.secondary.MONSOON} size={60} />
        </View>
      ) : (
        <Modal
          animationType="fade"
          transparent={true}
          visible={show}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <Fold color={Colors.secondary.MONSOON} size={60} />
          </View>
        </Modal>
      )}
    </>
  ) : null;
};

export default LoaderView;
