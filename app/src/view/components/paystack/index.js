import React from 'react';
import {Dimensions, View} from 'react-native';
import PaystackWebView from 'react-native-paystack-popup';
import {useSelector} from 'react-redux';
const {height, width} = Dimensions.get('screen');
const Paystack = ({setState, amount, onSuccess}) => {
  const ref = React.useRef(null);
  const {data} = useSelector(state => state.userData);
  const close = () => {
    setState(prevState => ({...prevState, showPaystack: false}));
  };
  return (
    <View
      style={{
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1000,
      }}>
      <PaystackWebView
        ref={ref}
        onError={() => {
          close();
        }}
        metadata={{
          custom_fields: [{display_name: data.name + ' ' + data.lastname}],
        }}
        onDismissed={() => {
          close();
        }}
        onSuccess={response => {
          onSuccess(response.reference);
          close();
        }}
        paystackKey={data.paystack}
        customerEmail={'abel@example.com'}
        amount={amount * 100}
      />
    </View>
  );
};

export default Paystack;
