import React from 'react';
import {View, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../../styles/colors';
import {useNavigation} from '@react-navigation/core';
import FONTS from '../../../conts/fonts';
import OptionModal from '../modals/OptionModal';

const Header = ({
  title,
  backgroundColor,
  stick,
  style,
  aniValue,
  headerHeight,
  iconColor,
}) => {
  const [showOptionModal, setShowOptionModal] = React.useState(false);
  const navigation = useNavigation();
  let background;
  let textOpacity;
  if (!backgroundColor) {
    background = aniValue.interpolate({
      inputRange: [0, headerHeight - 60],
      outputRange: ['#1C00ff00', COLORS.primary],
      extrapolate: 'clamp',
    });
    textOpacity = aniValue.interpolate({
      inputRange: [headerHeight - 60, headerHeight + 60],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }

  return (
    <Animated.View
      style={{
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: backgroundColor ? backgroundColor : background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: stick ? 'absolute' : 'relative',
        zIndex: stick && 1,
        ...style,
      }}>
      <OptionModal visible={showOptionModal} showModal={setShowOptionModal} />
      <Icon
        name="chevron-left"
        size={25}
        color={iconColor ? iconColor : COLORS.white}
        onPress={navigation.goBack}
      />
      <Animated.Text
        numberOfLines={1}
        style={{
          flex: 1,
          marginLeft: 10,
          fontFamily: FONTS.bold,
          color: COLORS.white,
          fontSize: 20,
          opacity: stick ? textOpacity : 1,
        }}>
        {title}
      </Animated.Text>
      <Icon
        onPress={() => setShowOptionModal(true)}
        name="dots-vertical"
        size={25}
        color={iconColor ? iconColor : COLORS.white}
      />
    </Animated.View>
  );
};

export default Header;
