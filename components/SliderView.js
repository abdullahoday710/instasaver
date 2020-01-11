/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import Carousel from 'react-native-snap-carousel';

import Video from 'react-native-video';

export default class SliderView extends Component {
  _renderItem = ({item, index}) => {
    if (item.type == "image") {
      return (
          <View>
              <Image  style={{width: 250, height: 250}} source={{uri: item.src}} />
          </View>
      )
    }

    else if (item.type == "video") {
      return (
        <View>
            <Video source={{uri:item.src}}
              style={styles.backgroundVideo}
              ref={(ref) => {this.player = ref}}
              paused={true}
              poster={item.thumbnail}  />
        </View>
      )

    }

}
  render() {
    return (
      <Carousel
             ref={(c) => { this._carousel = c; }}
             data={this.props.data}
             renderItem={this._renderItem}
             sliderWidth={350}
             itemWidth={250}
           />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    width:250,
    height:250,
},
});
