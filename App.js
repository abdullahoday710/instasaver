// @flow

import React from 'react';

import HomeScreen from './screens/HomeScreen.js'
import VideoPlayer from './screens/VideoPlayer.js'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions:{headerShown: false}
  },
  Player:{
    screen: VideoPlayer,
    navigationOptions:{headerShown: false}
  }
});

export default createAppContainer(AppNavigator);
