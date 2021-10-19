import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Text from '../Text';

const CustomInput = ({icon, type, error, ...props}) => {
  return (
    <View style={{flex: 1, width: '100%', marginBottom: 20}}>
      <View
        style={[
          style.inputContainer,
          error && {borderWidth: 0.7, borderColor: 'red'},
        ]}>
        {icon && (
          <Icon
            size={17}
            name={icon}
            color={type == 'secondary' ? COLORS.secondary : COLORS.primary}
          />
        )}
        <TextInput
          {...props}
          placeholderTextColor={COLORS.primary}
          style={style.input}
        />
      </View>
      {error && (
        <Text
          style={{fontSize: 10.5, paddingLeft: 10, marginTop: 5, color: 'red'}}>
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.light,
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: 5,
    color: COLORS.primary,
    fontFamily: FONTS.regular,
    fontSize: 11,
    flex: 1,
  },
});
export default CustomInput;
