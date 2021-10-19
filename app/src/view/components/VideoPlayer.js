import React from 'react';
import {View} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Image from './Image';
const VideoPlayer = ({videoId, time}) => {
  const [playing, setPlaying] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(false);
    setPlaying(false);
  }, [time]);

  const onStateChange = state => {
    if (state === 'ended') {
      setPlaying(false);
    }
  };

  return (
    <View style={{marginTop: 20, flex: 1, height: 200}}>
      {!ready && (
        <Image
          style={{
            width: '100%',
            height: 200,
            position: 'absolute',
            borderRadius: 5,
          }}
          source={require('../../assets/images/loadIcon.png')}
        />
      )}
      <YoutubePlayer
        onReady={() => {
          setReady(true);
          setPlaying(true);
        }}
        height={!ready ? 0 : 200}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
    </View>
  );
};

export default VideoPlayer;
