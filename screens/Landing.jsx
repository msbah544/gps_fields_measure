import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {Text, Icon, Layout, Button} from '@ui-kitten/components';

const img = require('../assets/area.jpg');
const Landing = ({navigation}) => {
  return (
    <Layout style={{flex: 1}}>
      <Image source={img} style={{height: 500}} />
      <Layout style={{alignItems: 'center', paddingTop: 5}}>
        <Text appearance="hint" category="h4">
          Fields Measure
        </Text>
        <Text appearance="hint" category="h6">
          Area / Distance / Perimeter
        </Text>
        <Layout style={{paddingTop: 10}}>
          <Button
            onPress={() => navigation.navigate('home')}
            size="giant"
            appearance="filled"
            TouchableOpacityprops={true}>
            get started
          </Button>
        </Layout>
        <Layout style={{paddingVertical: 10}}>
          <Text status="info">V_0.0.1</Text>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Landing;
