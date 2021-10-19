import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Text from '../Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ListItemSecond = ({course, onPress}) => {
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
            {course?.name}
          </Text>
          <Text numberOfLines={2} style={{color: COLORS.primary, fontSize: 11}}>
            {course?.description}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Icon name="cash" color={COLORS.secondary} size={18} />
              <View style={{justifyContent: 'center'}}>
                {course?.discountprice > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: 1,
                      backgroundColor: COLORS.secondary,
                      top: 8,
                      zIndex: 2,
                    }}
                  />
                )}

                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.secondary,
                    fontSize: 12,
                  }}>
                  {course?.price}
                </Text>
              </View>
            </View>
            {course?.discountprice > 0 && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="cash-multiple" color={COLORS.secondary} size={18} />
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.secondary,
                    fontSize: 12,
                  }}>
                  {course?.discountprice}
                </Text>
              </View>
            )}
          </View>
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
            source={{uri: course?.image}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItemSecond;
