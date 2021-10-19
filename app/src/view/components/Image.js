import React from 'react';
import {View, Image as RNImage} from 'react-native';
const Image = ({source, errorImage, style, ...props}) => {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <View
      style={
        Array.isArray(style)
          ? {
              height: style[0]?.height,
              width: style[0]?.width,
              position: style[0]?.position,
            }
          : {
              height: style?.height,
              width: style?.width,
              position: style?.position,
            }
      }>
      <RNImage
        onLoad={() => setLoaded(true)}
        source={source}
        style={
          Array.isArray(style) ? [...style, {zIndex: 0}] : {...style, zIndex: 0}
        }
        {...props}
      />
      {!loaded && (
        <RNImage
          source={errorImage && errorImage}
          style={
            Array.isArray(style)
              ? [
                  ...style,
                  {
                    zIndex: loaded ? -5 : 1,
                    position: 'absolute',
                  },
                ]
              : {...style, zIndex: loaded ? -5 : 1, position: 'absolute'}
          }
        />
      )}
    </View>
  );
};

export default Image;
