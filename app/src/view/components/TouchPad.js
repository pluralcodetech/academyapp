import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../conts/fonts';
import COLORS from '../../styles/colors';
import Text from './Text';
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'c'];
const deleteNum = setState => {
  setState(prevState => ({
    ...prevState,
    currentNumber: prevState.currentNumber.slice(
      0,
      prevState.currentNumber.length - 1,
    ),
  }));
};

const NumberTouch = ({num, setState, maxNum}) => {
  const press = () => {
    if (num == 'c') {
      deleteNum(setState);
    } else {
      setState(prevState => {
        if (prevState?.currentNumber?.length != maxNum) {
          return {
            ...prevState,
            currentNumber: prevState?.currentNumber + num,
          };
        } else {
          return prevState;
        }
      });
    }
    console.log(num);
    Vibration.vibrate(100);
  };
  return (
    <TouchableOpacity
      style={[style.numberTouch]}
      activeOpacity={0.1}
      onPress={press}>
      {num == 'c' ? (
        <Icon name="backspace" size={25} color={COLORS.white} />
      ) : (
        <Text
          style={{color: COLORS.white, fontFamily: FONTS.bold, fontSize: 24}}>
          {num}
        </Text>
      )}
    </TouchableOpacity>
  );
};
const TouchPad = ({setState, maxNum}) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 0,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={key => key.toString()}
        numColumns={3}
        data={numbers}
        renderItem={({item}) => (
          <NumberTouch num={item} setState={setState} maxNum={maxNum} />
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  numberTouch: {
    flex: 1,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default TouchPad;
