import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import COLORS from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import Text from '../components/Text';
import CoursesSlides from '../components/course/CoursesSlides';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../conts/fonts';
import ListItem from '../components/course/ListItem';
import {API} from '../../conts/api';
import BottomLoader from '../components/loaders/BottomLoader';
import {getAndUpdateUserData} from '../../logics/auth/user';
import {MessageAlertModal} from '../components/modals/MessageAlertModal';
import FormData from 'form-data';
import EpisodeHomeCard from '../components/episodes/EpisodeHomeCard';
import dummyData from '../../conts/dummyData';
import {useSelector} from 'react-redux';
const {height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {data} = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    upcomingClasses: dummyData,
    recentCourses: [],
    loading: true,
    showMessageModal: false,
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const upcomingClassesRef = React.useRef();
  React.useEffect(() => {
    getUpdates();
    getUpcomingClass();
    getAndUpdateUserData();
  }, []);

  const getUpdates = async () => {
    try {
      // Send request to reg the user

      const response = await fetch(API + 'recents.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resData = await response.json();

      setRefreshing(false);
      if (resData?.length > 0) {
        setState(prevState => ({
          ...prevState,
          recentCourses: resData,
          loading: false,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const getUpcomingClass = async () => {
    clearTimeout(upcomingClassesRef.current);
    setState(prevState => ({
      ...prevState,
      upcomingClasses: dummyData,
    }));
    try {
      // Send request to reg the user
      const response = await fetch(API + 'courses.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resData = await response.json();

      setRefreshing(false);
      if (resData?.pending?.length > 0) {
        setState(prevState => ({
          ...prevState,
          upcomingClasses: resData.pending.filter((p, index) => index < 3),
          loading: false,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    } catch (error) {
      console.log(error);
      upcomingClassesRef.current = setTimeout(getUpcomingClass, 7000);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getUpdates();
    getUpcomingClass();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <MessageAlertModal
        visible={state.showMessageModal}
        message={state.message}
        messageTitle={state.messageTitle}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={COLORS.white}
            colors={[COLORS.secondary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {/* Header section */}
        <View style={{minHeight: height * 0.45}}>
          <Image
            style={style.image}
            source={require('../../assets/images/bg.png')}
          />
          <View>
            <Text
              style={[
                globalStyles.title,
                {color: COLORS.secondary, margin: 20},
              ]}>
              Upcoming Classes
            </Text>
            <CoursesSlides courses={state.upcomingClasses} />
          </View>
        </View>
        <EpisodeHomeCard episode={data?.webseries} />
        {/* Bottom section */}
        <View
          style={{
            paddingTop: 20,
            paddingBottom: 0,
            flex: 1,
          }}>
          {/* Episodes section */}

          {/* End of episode section */}

          {/* <View style={style.inputContainer}>
            <Icon name="magnify" color={'#8190F7'} size={24} />
            <TextInput
              onChangeText={value => setSearchText(value)}
              placeholder="Search Our Programs"
              placeholderTextColor={'#8190F7'}
              style={style.searchInput}
            />
          </View> */}
          <Text
            style={{
              marginVertical: 20,
              color: COLORS.primary,
              fontFamily: FONTS.bold,
              fontSize: 18,
              marginHorizontal: 20,
            }}>
            Recent Updates
          </Text>
          {state.loading ? (
            <BottomLoader />
          ) : (
            !state.loading &&
            state.recentCourses.length == 0 && (
              <Text
                style={{flex: 1, textAlign: 'center', color: COLORS.primary}}>
                No Update Found
              </Text>
            )
          )}

          <FlatList
            data={state.recentCourses}
            renderItem={({item}) => (
              <ListItem
                course={item}
                onPress={() => {
                  if (item.cattype.toUpperCase() == 'COURSE') {
                    navigation.navigate('CourseDetailsScreen', {
                      details: item,
                      time: new Date().getTime(),
                    });
                  } else {
                    navigation.navigate('EventsDetails', {
                      details: item,
                      time: new Date().getTime(),
                    });
                  }
                }}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
  },
  inputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 30,
    elevation: 0.5,
  },
  searchInput: {
    color: '#8190F7',
    fontFamily: FONTS.bold,
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
});
export default HomeScreen;
