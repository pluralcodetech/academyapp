import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Text from '../Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Image from '../Image';
import {useNavigation} from '@react-navigation/core';
const EpisodeHomeCard = ({episode}) => {
  const navigation = useNavigation();
  return (
    <View style={style.episodeContainer}>
      <ImageBackground
        source={require('../../../assets/images/Rectangle.png')}
        style={style.episodeCard}>
        <View style={{flexDirection: 'row', height: 50}}>
          <Image
            errorImage={require('../../../assets/images/avatar.png')}
            source={{uri: episode?.authorimage}}
            style={style.episodeCardImage}
          />
          <View style={{marginLeft: 5, minHeight: 10}}>
            <Text
              numberOfLines={2}
              style={{
                color: COLORS.white,
                fontFamily: FONTS.bold,
                fontSize: 14,
              }}>
              {episode?.name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Icon name="microphone" color={COLORS.white} />
              <Text style={{color: COLORS.white, fontSize: 10}}>
                {episode?.date}
              </Text>
            </View>
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={{color: COLORS.white, marginTop: 0, fontSize: 12, flex: 1}}>
          {episode?.description}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EpisodeDetailsScreen', {
              details: episode,
              time: new Date().getTime(),
            })
          }
          activeOpacity={0.7}
          style={style.btn}>
          <Icon name="headphones" color={COLORS.primary} size={16} />
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: FONTS.bold,
              fontSize: 12,
            }}>
            VIEW EPISODE
          </Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={style.episodeCardDetails}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 10,
            color: COLORS.primary,
            fontFamily: FONTS.bold,
          }}>
          See previous episodes
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EpisodesScreen', {time: new Date().getTime()})
          }
          activeOpacity={0.7}
          style={{
            height: 30,
            backgroundColor: COLORS.secondary,
            borderRadius: 3,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: FONTS.bold,
              color: COLORS.white,
            }}>
            VIEW
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  episodeContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  episodeCard: {
    overflow: 'hidden',
    borderRadius: 7,
    flex: 1,
    height: 120,
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  episodeCardDetails: {
    borderRadius: 7,
    height: 120,
    width: 80,
    backgroundColor: COLORS.white,
    borderWidth: 0.3,
    borderColor: COLORS.grey,
    marginLeft: 10,
    padding: 5,
    justifyContent: 'space-between',
  },
  episodeCardImage: {
    height: 42,
    width: 42,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: COLORS.white,
  },
  btn: {
    height: 30,
    backgroundColor: COLORS.light,
    borderRadius: 3,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default EpisodeHomeCard;
