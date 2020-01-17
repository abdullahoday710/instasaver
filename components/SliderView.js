/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
      var src = item.src;
      //var poster = item.thumbnail;
      return (
        <View style={styles.opacityContainer}>

              <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("Player" , {videoSource:item.src, poster:item.thumbnail})
                }}>

                <Image  style={{width: 250, height: 250}} source={{uri:item.thumbnail}} />
              </TouchableOpacity>
              <Icon name="play-arrow" size={50} style={{position:"absolute", color:"white"}}/>
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
opacityContainer:{
  alignItems:"center",
  justifyContent:"center"
}
});
