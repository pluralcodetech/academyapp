import React from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Text from '../Text';
import Image from '../Image';
import {useNavigation} from '@react-navigation/core';
import COLORS from '../../../styles/colors';
import FONTS from '../../../conts/fonts';
const {height, width} = Dimensions.get('window');
const cardWidth = width * 0.7;
const cardBorderRadius = 10;
const Card = ({course, navigation, index}) => {
  return (
    <TouchableOpacity
      disabled={course?.dummyData}
      onPress={() =>
        navigation.navigate('CourseDetailsScreen', {
          details: course,
          time: new Date().getTime() + index,
        })
      }
      activeOpacity={1}>
      <View style={style.card}>
        <Image
          errorImage={require('../../../assets/images/loadIcon.png')}
          source={course?.dummyData ? course.image : {uri: course?.image}}
          style={style.image}
        />
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(255,179,65,0.3)',
            borderRadius: cardBorderRadius,
            position: 'absolute',
          }}
        />
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            padding: 10,
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}>
          <Text
            style={{color: COLORS.white, fontFamily: FONTS.bold, fontSize: 18}}>
            {course?.name}
          </Text>
          <Text style={{color: COLORS.white, fontSize: 12}}>
            {course?.start_date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const CoursesSlides = ({courses}) => {
  const navigation = useNavigation();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / cardWidth);
    setCurrentSlideIndex(currentIndex);
  };
  return (
    <View>
      <FlatList
        snapToInterval={cardWidth}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: 20, marginTop: 10}}
        horizontal
        data={courses}
        renderItem={({item, index}) => (
          <Card index={index} course={item} navigation={navigation} />
        )}
      />
      <View
        style={{
          paddingHorizontal: 30,
          marginTop: 10,
          flexDirection: 'row',
        }}>
        {courses.map((_, index) => (
          <View
            key={'indicator' + index}
            style={[
              style.indicator,
              currentSlideIndex == index && {
                borderColor: COLORS.white,
                backgroundColor: 'transparent',
              },
            ]}></View>
        ))}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  indicator: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    height: 13,
    width: 13,
    borderRadius: 7,
    backgroundColor: COLORS.secondary,
    marginRight: 7,
  },
  card: {
    borderRadius: cardBorderRadius,
    height: height * 0.23,
    width: cardWidth,
    marginRight: 20,
  },
  image: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
    borderRadius: cardBorderRadius,
  },
});

export default CoursesSlides;
