import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';
import COLORS from '../../styles/colors';
import Header from '../components/Layouts/Header';
import PreLoader from '../components/loaders/PreLoader';
import {openMessageModal} from '../components/modals/MessageAlertModal';
const {width, height} = Dimensions.get('window');

const PdfScreen = ({navigation, route}) => {
  const {source, time} = route.params;

  const [showPreloader, setShowPreloader] = React.useState(true);
  React.useEffect(() => {
    setShowPreloader(true);
  }, [time]);
  return (
    <SafeAreaView>
      <Header backgroundColor={COLORS.primary} title="PDF Viewer" />
      <PreLoader visible={showPreloader} />
      <View style={styles.container}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            setShowPreloader(false);
          }}
          onPageChanged={(page, numberOfPages) => {}}
          onError={error => {
            setShowPreloader(false);
            console.log(error);
            setTimeout(() => {
              openMessageModal(
                'Error',
                'Cannot create document: File not in PDF format or corrupted.',
                'error',
              );
            }, 500);

            console.log(error);
            navigation.goBack();
          }}
          onPressLink={uri => {
            console.log(`Link presse: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 70,
    paddingBottom: 100,
    position: 'absolute',
    width,
    height,
    zIndex: 10000,
  },
  pdf: {
    flex: 1,
    width,
    height,
  },
});

export default PdfScreen;
