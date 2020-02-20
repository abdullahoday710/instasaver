/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';

import {RNFFmpeg } from 'react-native-ffmpeg';
import { TextInput, DarkTheme, Button, Checkbox  } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import SliderView from "../components/SliderView.js"
import Header from "../components/Header.js"

var RNFS = require('react-native-fs');

const DOWNLOAD_PATH = RNFS.ExternalStorageDirectoryPath + "/Insta-saver/downloads"

export default class DetailsScreen extends Component {

  state = {isLoading:true, checked:false, ableToCombine:false}
  process_link = async () => {
    //slides request
    //var request = await fetch("https://www.instagram.com/p/B7rm9dwnOPr/")

    //slides with multiple videos
    // https://www.instagram.com/p/B7rUaMuH6fR/
    // single media request
    //var request = await fetch("https://www.instagram.com/p/B7Ic00NH0A4/")
    var link = this.props.navigation.getParam('url', 'NO-ID')
    var request = await fetch(link)
    text = await request.text()

    // getting all json data from the html page
    var matches = text.match(/\{.*\:\{.*\:.*\}\}/g);

    matches.forEach((element) => {
        if (element.includes("graphql")) {
            var videos_count = 0
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
                src_arr.forEach((media) => {
                  if(media.type === "video"){
                    videos_count++
                  }
                })
                if (videos_count >= 2) {
                  this.setState({ ableToCombine: true, })
                }
                else {
                  this.setState({ ableToCombine: false, })
                }
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


  save_media = async () => {
    this.setState({downloading:true})
    file_names = []
    tasks = []
    finished_downloads = 0
    var exists = await RNFS.exists(DOWNLOAD_PATH)
    if (!exists) {
      await RNFS.mkdir(DOWNLOAD_PATH)
    }
    var media_list = this.state.media_urls
    this.setState({downloadCount:media_list.length})
    await media_list.forEach(async(item) => {
      if (item.type == "video") {
        let random = Math.random().toString(36).substring(7);
        file_names.push(random+".mp4")
        var task = RNFS.downloadFile({fromUrl:item.src, toFile:DOWNLOAD_PATH+"/"+random+".mp4"})
        tasks.push(task)

      }
      else if (item.type == "image") {
        let random = Math.random().toString(36).substring(7);
        var task = RNFS.downloadFile({fromUrl:item.src,toFile:DOWNLOAD_PATH+"/"+random+".jpg"})
        tasks.push(task)
      }
    })
      //Looping through download tasks and continuously checking if all the tasks are done
      tasks.forEach((task) => {
        task.promise.then(async() => {
          finished_downloads++
          if (media_list.length === finished_downloads) {
              this.setState({downloading:false, lastSavedMedia:media_list})
              if(!this.state.checked){
                  this.cancel()
              }
              
              if (this.state.checked && this.state.ableToCombine &! this.state.downloading) {
                concat_str = ""
                await file_names.forEach((name) => {
                  str_dummy = "file " + DOWNLOAD_PATH + "/" +name + "\n"
                  concat_str += str_dummy
                })
                console.warn(concat_str)
                let list_name = Math.random().toString(36).substring(7);
                await RNFS.writeFile(DOWNLOAD_PATH + "/"+list_name +".txt" , concat_str, "utf8")
                let final_output_name = Math.random().toString(36).substring(7);
                await RNFFmpeg.execute("-f concat -safe 0 -i "+DOWNLOAD_PATH +"/"+list_name+".txt"+" -c copy "+ DOWNLOAD_PATH+"/"+final_output_name+".mp4")
                RNFS.unlink(DOWNLOAD_PATH + "/" +list_name+".txt")
                file_names.forEach((name) => {
                  RNFS.unlink(DOWNLOAD_PATH + "/" +name)
                });
              }
          }
        })
      })



  }

  componentDidMount(){

    this.process_link()
  }

  cancel = () => {
    this.props.navigation.navigate("Home")
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
        <ActivityIndicator size={25}/>
        </View>
      );
    }
    if (this.state.downloading == true) {
      return (
      <React.Fragment>
        <Header title="insta saver"/>
        <View style={styles.container}>
          <View style={styles.itemsContainer}>
            <SliderView data={this.state.media_urls} navigation={this.props.navigation}/>
            <ActivityIndicator size={40}/>
            <Text style={{color:"white"}}>Saving...</Text>
          </View>
        </View>
      </React.Fragment>
    )
    }
    const { checked } = this.state;
      return (
      <React.Fragment>
        <Header title="insta saver"/>
        <View style={styles.container}>
          <View style={styles.itemsContainer}>
          <SliderView data={this.state.media_urls} navigation={this.props.navigation}/>
            <Button style={{marginBottom:10}} mode="contained" theme={DarkTheme} onPress={this.save_media}>
              save
            </Button>
            <Button mode="contained" theme={DarkTheme} onPress={this.cancel}>
              Cancel
            </Button>

            {this.state.ableToCombine ? (<View style={{ flexDirection: 'row' }}><Checkbox
                          status={checked ? 'checked' : 'unchecked'}
                          theme={DarkTheme}
                          onPress={() => { this.setState({ checked: !checked }); }}
                          />
                        <Text style={{marginTop: 6, color:"white", fontSize:17}}> Combine videos</Text></View>):(
                          <View style={{ flexDirection: 'row' }}><Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            theme={DarkTheme}
                            onPress={() => { this.setState({ checked: !checked }); }}
                            disabled={true}
                            />
                          <Text style={{marginTop: 6, color:"gray", fontSize:17}}> Combine videos</Text></View>
                        )}
          </View>


        </View>
      </React.Fragment>
      )

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
