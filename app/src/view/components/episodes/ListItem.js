import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Text from '../Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ListItem = ({episode, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={{
          height: 100,
          flexDirection: 'row',
          marginBottom: 20,
          marginHorizontal: 20,
          backgroundColor: COLORS.white,
          padding: 10,
        }}>
        <View style={{paddingHorizontal: 10, flex: 1}}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: FONTS.bold,
              color: COLORS.primary,
              fontSize: 15,
            }}>
            {episode?.name}
          </Text>
          <Text numberOfLines={2} style={{color: COLORS.primary, fontSize: 11}}>
            {episode?.description}
          </Text>
        </View>
        <View>
          <Image
            style={{
              height: '100%',
              width: 85,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
            errorImage={require('../../../assets/images/loadIcon.png')}
            source={{uri: episode?.image}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
