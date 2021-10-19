import React from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import Text from '../components/Text';
import COLORS from '../../styles/colors';
import Header from '../components/Layouts/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../conts/fonts';
import BottomLoader from '../components/loaders/BottomLoader';
import {API} from '../../conts/api';
import {useSelector} from 'react-redux';
import FormData from 'form-data';
import ListItem from '../components/episodes/ListItem';

const EpisodesScreen = ({navigation, route}) => {
  const {time} = route?.params ?? {};
  const {data} = useSelector(state => state.userData);

  const [searchText, setSearchText] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [state, setState] = React.useState({
    id: data.id,
    episode: [],
    loading: true,
  });

  React.useEffect(() => {
    getEpisodes();
  }, [time]);

  React.useEffect(() => {
    if (searchText == '') {
      getEpisodes();
    } else {
      searchEpisode(searchText);
    }
  }, [searchText]);

  const getEpisodes = async () => {
    setState(prevState => ({
      ...prevState,
      episode: [],
      loading: true,
    }));

    try {
      // Send request to reg the user

      const response = await fetch(API + 'webseries.php', {
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
          episode: resData,
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

  const searchEpisode = async searchText => {
    setState(prevState => ({
      ...prevState,
      episode: [],
      loading: true,
    }));

    try {
      // Create and append details to form
      const form = new FormData();
      form.append('searchseries', searchText);
      // Send request to reg the user

      const response = await fetch(API + '/webseriessearch.php', {
        method: 'POST',
        headers: {
          Accepts: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData?.length > 0) {
        setState(prevState => ({
          ...prevState,
          episode: resData,
          loading: false,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
          episode: [],
        }));
        v;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchText('');
    getEpisodes();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <Header backgroundColor={COLORS.primary} title="Episodes" />
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
          <Text
            style={[
              style.courseCategoryTitle,
              {
                color: COLORS.secondary,
              },
            ]}>
            PluralCode Web Series (Episodes)
          </Text>

          <View style={[style.indicator]} />
        </View>
        {state.loading ? (
          <BottomLoader />
        ) : (
          !state.loading &&
          state.episode.length == 0 && (
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
                No Episode Found
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
            contentContainerStyle={{paddingBottom: 320}}
            data={state.episode}
            renderItem={({item}) => (
              <ListItem
                episode={item}
                onPress={() =>
                  navigation.navigate('EpisodeDetailsScreen', {
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
  indicator: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary,
    bottom: 0,
  },
});

export default EpisodesScreen;
