import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  RefreshControl,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import COLORS from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import Text from '../components/Text';
import EventsSlides from '../components/event/EventsSlides';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../conts/fonts';
import ListItem from '../components/course/ListItem';
import BottomLoader from '../components/loaders/BottomLoader';
import {API} from '../../conts/api';
import FormData from 'form-data';
const {height} = Dimensions.get('window');
import dummyData from '../../conts/dummyData';
const NewAndEventsScreen = ({navigation, route}) => {
  const {time} = route?.params ?? {};
  const [state, setState] = React.useState({
    upcomingEvents: dummyData,
    events: [],
    loading: true,
  });

  const [searchText, setSearchText] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getEvent();
  }, [time]);

  React.useEffect(() => {
    if (searchText == '') {
      getEvent();
    } else {
      searchEvent(searchText);
    }
  }, [searchText]);

  const getEvent = async () => {
    setState(prevState => ({
      ...prevState,
      upcomingEvents: dummyData,
      events: [],
      loading: true,
    }));
    try {
      // Send request to reg the user

      const response = await fetch(API + 'events.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setRefreshing(false);
      if (data?.length > 0) {
        setState(prevState => ({
          ...prevState,
          upcomingEvents: data.filter((_, index) => index < 3),
          events: data,
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

  const searchEvent = async searchText => {
    setState(prevState => ({
      ...prevState,
      events: [],
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

      const data = await response.json();

      if (data?.[0].events.length > 0) {
        setState(prevState => ({
          ...prevState,
          events: data?.[0].events,
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
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getEvent();
    setSearchText('');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            progressBackgroundColor={COLORS.white}
            colors={[COLORS.secondary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}>
        {/* Header section */}
        <View style={{minHeight: height * 0.45}}>
          <View>
            <Text
              style={[
                globalStyles.title,
                {color: COLORS.secondary, margin: 20},
              ]}>
              {'News & Events'}
            </Text>
            <View style={style.inputContainer}>
              <Icon name="magnify" color={'#8190F7'} size={24} />
              <TextInput
                value={searchText}
                onChangeText={value => setSearchText(value)}
                placeholder="Search"
                placeholderTextColor={'#8190F7'}
                style={style.searchInput}
              />
            </View>
            <EventsSlides events={state.upcomingEvents} />
          </View>
        </View>

        {/* Bottom section */}
        <View
          style={{
            paddingBottom: 0,
            flex: 1,
          }}>
          {state.loading ? (
            <BottomLoader />
          ) : (
            !state.loading &&
            state.events.length == 0 && (
              <Text
                style={{flex: 1, textAlign: 'center', color: COLORS.primary}}>
                No Course Found
              </Text>
            )
          )}
          <FlatList
            data={state.events}
            renderItem={({item}) => (
              <ListItem
                course={item}
                onPress={() =>
                  navigation.navigate('EventsDetails', {
                    details: item,
                    time: new Date().getTime(),
                  })
                }
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
    marginBottom: 20,
  },
  searchInput: {
    fontFamily: FONTS.bold,
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    color: '#8190F7',
  },
});

export default NewAndEventsScreen;
