import React from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Text from '../components/Text';
import COLORS from '../../styles/colors';
import Header from '../components/Layouts/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../conts/fonts';
import BottomLoader from '../components/loaders/BottomLoader';
import ListItemSecond from '../components/course/ListItemSecond';
import {API} from '../../conts/api';
import {useSelector} from 'react-redux';
import FormData from 'form-data';

const CoursesScreen = ({navigation, route}) => {
  const {time} = route.params ?? {};
  const {data} = useSelector(state => state.userData);
  const courseCategory = ['All Courses', 'Enrolled Courses'];

  const [selectedCourseIndex, setSelectedCourseIndex] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [state, setState] = React.useState({
    id: data.id,
    course: [],
    loading: true,
  });

  React.useEffect(() => {
    getCourse();
    setSelectedCourseIndex(0);
  }, [time]);

  React.useEffect(() => {
    if (searchText == '') {
      getCourse();
    } else {
      searchCourse(searchText);
    }
  }, [searchText]);

  const getCourse = async () => {
    setState(prevState => ({
      ...prevState,
      course: [],
      loading: true,
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
          course: resData.pending,
          loading: false,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    } catch (error) {
      setRefreshing(false);
      console.log(error);
    }
  };

  const getEnrolledCourse = async () => {
    setState(prevState => ({
      ...prevState,
      course: [],
      loading: true,
    }));

    try {
      //Create and append to form
      const form = new FormData();
      form.append('studentid', state.id);
      // Send request to reg the user
      const response = await fetch(API + 'usercourse.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData?.length > 0) {
        setState(prevState => ({
          ...prevState,
          course: resData,
          loading: false,
        }));
      } else {
        console.log('No course');
        setState(prevState => ({
          ...prevState,
          loading: false,
          course: [],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchCourse = async searchText => {
    setState(prevState => ({
      ...prevState,
      course: [],
      loading: true,
    }));

    try {
      // Create and append details to form
      const form = new FormData();
      form.append('Global_search', searchText);
      // Send request to reg the user

      const response = await fetch(API + 'search.php', {
        method: 'POST',
        headers: {
          Accepts: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData?.[0].course.length > 0) {
        setState(prevState => ({
          ...prevState,
          course: resData?.[0].course,
          loading: false,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
          course: [],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getCourse();
    setSelectedCourseIndex(0);
    setSearchText('');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <Header backgroundColor={COLORS.primary} title="Courses" />
      <View style={style.headerSection}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            value={searchText}
            placeholderTextColor={COLORS.white}
            placeholder="Search"
            onChangeText={value => setSearchText(value)}
            style={style.textInput}
          />
          <Icon name="magnify" size={28} color={COLORS.white} />
        </View>
      </View>
      <View>
        <View style={style.courseCategoryCon}>
          {courseCategory.map((course, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedCourseIndex(index);
                if (index == 1) {
                  getEnrolledCourse();
                } else {
                  getCourse();
                }
              }}>
              <Text
                style={[
                  style.courseCategoryTitle,
                  selectedCourseIndex == index && {
                    color: COLORS.secondary,
                  },
                ]}>
                {course}
              </Text>
            </TouchableOpacity>
          ))}
          <View
            style={[
              style.indicator,
              {left: selectedCourseIndex == '0' ? 0 : '50%', zIndex: 1},
            ]}
          />
          <View
            style={[
              style.indicator,
              {width: '100%', backgroundColor: '#dedede'},
            ]}
          />
        </View>
        {state.loading ? (
          <BottomLoader />
        ) : (
          !state.loading &&
          state.course.length == 0 && (
            <View
              style={{
                height: 50,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: COLORS.primary,
                  marginTop: 20,
                }}>
                No Course Found
              </Text>
            </View>
          )
        )}
        <View>
          <FlatList
            refreshControl={
              <RefreshControl
                progressBackgroundColor={COLORS.white}
                colors={[COLORS.secondary]}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            keyExtractor={(_, key) => 'courseId' + key.toString()}
            contentContainerStyle={{paddingBottom: 320}}
            data={state.course}
            renderItem={({item}) => (
              <ListItemSecond
                course={item}
                onPress={() =>
                  navigation.navigate('CourseDetailsScreen', {
                    details: item,
                    time: new Date().getTime(),
                  })
                }
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  courseCategoryCon: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  courseCategoryTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: '#dedede',
  },
  indicator: {
    position: 'absolute',
    width: '50%',
    height: 2,
    backgroundColor: COLORS.primary,
    bottom: 0,
  },
  textInput: {
    flex: 1,
    borderColor: COLORS.white,
    borderBottomWidth: 1.5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  headerSection: {
    height: 100,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});

export default CoursesScreen;
