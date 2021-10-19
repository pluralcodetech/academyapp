import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Text from '../Text';
const ListItem = ({course, onPress}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={{
          height: 80,
          flexDirection: 'row',
          marginBottom: 20,
          marginHorizontal: 20,
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
        }}>
        <View>
          <Image
            errorImage={require('../../../assets/images/loadIcon.png')}
            style={{
              height: '100%',
              width: 85,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
            source={{uri: course?.image}}
          />
        </View>

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
          <TouchableOpacity onPress={onPress}>
            <Text
              numberOfLines={2}
              style={{color: COLORS.secondary, fontSize: 10}}>
              Read More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
