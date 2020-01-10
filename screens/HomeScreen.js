/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

var DomParser = require('react-native-html-parser').DOMParser


export default class HomeScreen extends Component {
  state = {isLoading:true}
  test = async () => {
    var request = await fetch("https://www.instagram.com/p/B7Gz8Y-howp/")
    text = await request.text()
    // getting all json data from the html page
    var matches = text.match(/\{.*\:\{.*\:.*\}\}/g);

    matches.forEach((element) => {
        if (element.includes("graphql")) {
            formatted = element + "}}"
            var json = JSON.parse(formatted)
            // if the post is made of "slides"
            media_array = json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges
            media_array.forEach((node) => {
                if (node.node.__typename == "GraphVideo") {
                  console.warn(node.node.video_url)
                }
                else if (node.node.__typename == "GraphImage") {
                  console.warn(node.node.display_url)
                }
              })
            this.setState({ src: src, isLoading:false })

        }
      })
  }
   componentDidMount(){

     this.test()
  }


  render() {
    if (this.state.isLoading) {
      <View style={styles.container}>
        <Text>I'm the HomeScreen component</Text>
      </View>
    }
    return (
      <View style={styles.container}>
        <Text>I'm the HomeScreen componaaaaaent</Text>
        <Image  style={{width: 200, height: 200}} source={{uri: this.state.src}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
