import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../conts/fonts';
import COLORS from '../../styles/colors';
import Header from '../components/Layouts/Header';
import Text from '../components/Text';
import Paystack from '../components/paystack';

const CheckoutScreen = ({navigation, route}) => {
  const details = route.params.details;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <Header backgroundColor={COLORS.secondary} title="Checkout" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.amountCon}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={style.line} />
            <Text
              style={{
                fontSize: 18,
                color: COLORS.white,
                fontFamily: FONTS.bold,
              }}>
              Total Amount
            </Text>
            <View style={style.line} />
          </View>
          <Text style={style.amountText}>₦70,000</Text>
        </View>
        {/* Show Paystack */}
        <Paystack />
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  amountCon: {
    height: 150,
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  line: {
    height: 1.5,
    width: 40,
    backgroundColor: COLORS.white,
    marginHorizontal: 5,
  },
  btn: {
    borderRadius: 5,
    margin: 20,
    height: 50,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  amountText: {
    fontSize: 25,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginTop: 5,
  },
});
export default CheckoutScreen;
