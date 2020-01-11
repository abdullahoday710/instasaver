/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';

import { TextInput, DarkTheme, Button } from 'react-native-paper';

import SliderView from "../components/SliderView.js"
import Header from "../components/Header.js"

export default class HomeScreen extends Component {

  state = {isLoading:false, hasPastedLink:false}
  process_link = async () => {
    //slides request
    //var request = await fetch("https://www.instagram.com/p/B7Gz8Y-howp/")

    // single media request
    //var request = await fetch("https://www.instagram.com/p/B7Ic00NH0A4/")
    this.setState({isLoading:true, hasPastedLink:true})

    var request = await fetch(this.state.text)
    text = await request.text()
    // getting all json data from the html page
    var matches = text.match(/\{.*\:\{.*\:.*\}\}/g);

    matches.forEach((element) => {
        if (element.includes("graphql")) {
            formatted = element + "}}"
            var json = JSON.parse(formatted)

            var src_arr = []

            // if the instagram post is made of "slides"
            if (json.entry_data.PostPage[0].graphql.shortcode_media.hasOwnProperty("edge_sidecar_to_children")) {
              var media_array = json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges
              media_array.forEach((node) => {
                  if (node.node.__typename == "GraphVideo") {
                    var data = {"type":"video", "src":node.node.video_url, "thumbnail":node.node.display_url}
                    src_arr.push(data)
                  }
                  else if (node.node.__typename == "GraphImage") {
                    var data = {"type":"image", "src":node.node.display_url}
                    src_arr.push(data)
                    this.setState({ src: node.node.display_url})
                  }
                })

                this.setState({ media_urls: src_arr, isLoading:false })
            }



            // if the instagram post is a single video or image
            else {
              var media = json.entry_data.PostPage[0].graphql.shortcode_media
              var media_type = media.__typename
              if (media_type == "GraphVideo") {
                var data = [{"type":"video", "src":media.video_url}]
                this.setState({media_urls: data, isLoading:false})
              }
              else if (media_type == "GraphImage") {
                resources = media.display_resources
                resources.forEach((resource) => {
                if (resource.config_width == 1080 && resource.config_height == 1080) {
                    var data = [{"type":"image", "src":resource.src}]
                    this.setState({media_urls: data, isLoading:false})
                  }
                })
              }
            }

        }
      })
  }

  cancel = () => {
    this.setState({text:"", isLoading:false, hasPastedLink:false})
  }


  render() {
    if (this.state.isLoading) {
      return(
      <View style={styles.container}>
        <ActivityIndicator />
      </View>)
    }
    else if (this.state.hasPastedLink && this.state.isLoading == false) {
      return (
      <React.Fragment>
        <Header title="insta saver"/>
        <View style={styles.container}>
          <View style={styles.itemsContainer}>
          <SliderView data={this.state.media_urls} />
            <Button style={{marginBottom:10}} mode="contained" theme={DarkTheme}>
              save
            </Button>
            <Button onPress={this.cancel} mode="contained" theme={DarkTheme}>
              Cancel
            </Button>
          </View>


        </View>
      </React.Fragment>
      )
    }
    else {


    return (
      <React.Fragment>
        <Header title="insta saver"/>
        <View style={styles.container}>

            <TextInput
              label='Paste the post link here.'
              value={this.state.text}
              mode='outlined'
              onChangeText={text => this.setState({text:text})}
              theme={DarkTheme}
              style={{width:"66%", height:50, marginBottom:50}}
              />
            <Button style={styles.goButton} mode="contained" theme={DarkTheme} onPress={this.process_link}>
              Go to post
            </Button>

        </View>
      </React.Fragment>
    )}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor:"#121212"
  },
  itemsContainer:{
    marginTop:50,
    marginBottom:100,
  },
  goButton:{
    marginTop:-10,
  }
});
