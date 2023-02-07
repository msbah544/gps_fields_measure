import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {View} from 'react-native';
import Top from '../components/Top';
import Map from '../components/Map';

const Home = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <Top navigation={navigation} />
      <View style={{flex: 1}}>
        <Map navigation={navigation} />
      </View>
    </View>
  );
};

export default Home;
