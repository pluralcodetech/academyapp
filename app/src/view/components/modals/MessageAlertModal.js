import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Text from '../Text';
import COLORS from '../../../styles/colors';
import FONTS from '../../../conts/fonts';
import {meessageAlertModalAction} from '../../../redux/actions';
import store from '../../../redux/store';

const MessageAlertModal = ({visible, title, message, closeModal, option}) => {
  const [modalHeigt, setModalHeight] = React.useState(0);
  const aniValue = React.useRef(new Animated.Value(250)).current;
  React.useEffect(() => {
    openModal();
  }, [visible]);
  const close = () => {
    Animated.timing(aniValue, {
      toValue: modalHeigt,
      duration: 200,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        closeModal(false);
      }
    });
  };
  const openModal = () => {
    if (visible) {
      Animated.timing(aniValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.modal, {transform: [{translateY: aniValue}]}]}
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            setModalHeight(height);
          }}>
          <Text
            style={{color: COLORS.white, fontFamily: FONTS.bold, fontSize: 25}}>
            {title}
          </Text>
          <Text style={{color: COLORS.white, fontSize: 14}}>{message}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            {/* Check if is option button type */}
            {Array.isArray(option) ? (
              <View style={{flexDirection: 'row', flex: 1}}>
                {/* First button */}
                {option?.[0] && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.btn,
                      {
                        backgroundColor:
                          option.length == 1 ? COLORS.secondary : COLORS.red,
                      },
                    ]}
                    onPress={
                      option[0]?.onPress
                        ? () => {
                            close();
                            option[0]?.onPress?.();
                          }
                        : close
                    }>
                    <Text style={styles.btnTitle}>{option[0]?.text}</Text>
                  </TouchableOpacity>
                )}

                <View style={{width: 15}} />
                {/* Second button */}
                {option?.[1] && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.btn,
                      {
                        backgroundColor: COLORS.secondary,
                      },
                    ]}
                    onPress={
                      option[1]?.onPress
                        ? () => {
                            close();
                            option[1]?.onPress?.();
                          }
                        : close
                    }>
                    <Text style={styles.btnTitle}>{option[1]?.text}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      option == 'error' ? COLORS.red : COLORS.secondary,
                  },
                ]}
                onPress={close}>
                <Text style={styles.btnTitle}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const openMessageModal = (title, message, option) => {
  store.dispatch(
    meessageAlertModalAction({visible: true, title, message, option}),
  );
};

const closeMessageModal = () => {
  store.dispatch(
    meessageAlertModalAction({visible: false, title: '', message: ''}),
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  btn: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTitle: {color: COLORS.white, fontFamily: FONTS.bold},
});

export {MessageAlertModal, openMessageModal, closeMessageModal};
