// @flow

import React from 'react';

import HomeScreen from './screens/HomeScreen.js'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions:{header: null}
  },
});

export default createAppContainer(AppNavigator);
