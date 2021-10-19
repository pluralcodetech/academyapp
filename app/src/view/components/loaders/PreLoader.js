import React from 'react';
import {Modal, View, StyleSheet, ActivityIndicator} from 'react-native';
import Text from '../Text';
import COLORS from '../../../styles/colors';
import FONTS from '../../../conts/fonts';

const PreLoader = ({visible, message = 'Loading...'}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(38,55,171,0.1)',
        }}>
        <View
          style={{
            height: 80,
            backgroundColor: COLORS.light,
            width: '80%',
            alignItems: 'center',
            borderRadius: 4,
            flexDirection: 'row',
          }}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondary}
            style={{marginLeft: 20, marginRight: 15}}
          />
          <Text
            style={{
              fontSize: 14,
              color: COLORS.primary,
              fontFamily: FONTS.bold,
            }}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default PreLoader;
