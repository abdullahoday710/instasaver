/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid
} from 'react-native';
import Header from "../components/Header.js"
import { TextInput, DarkTheme, Button } from 'react-native-paper';

export default class HomeScreen extends Component {
  state = {text: ""}
   goToDetails = () => {
    this.props.navigation.navigate("Details", {url:this.state.text})
  }

  requestPermission = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage permission',
          message:
            'Insta saver needs access to your Storage ' +
            'so you can save photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
      } else {
        this.requestPermission()
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount(){
    this.requestPermission()
  }

  render() {
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
            <Button style={styles.goButton} mode="contained" theme={DarkTheme} onPress={this.goToDetails}>
              Go to post
            </Button>

        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor:"#121212"
  },
});
