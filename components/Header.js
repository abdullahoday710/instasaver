/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Appbar} from 'react-native-paper';
export default class Header extends Component {
  render() {
    return (
        <Appbar.Header style={{backgroundColor: "#242323"}}>
          <Appbar.Content
            title={this.props.title}
          />
        </Appbar.Header>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 45,
  },
});
