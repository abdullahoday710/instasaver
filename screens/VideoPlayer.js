/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Video from 'react-native-video';


export default class VideoPlayer extends Component {
  render() {

    return (
      <View style={styles.container}>
        <Video source={{uri:this.props.navigation.getParam('videoSource', 'NO-ID')}}
  style={styles.backgroundVideo}
  resizeMode="contain"
  ref={(ref) => {this.player = ref}}  />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"black",
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
