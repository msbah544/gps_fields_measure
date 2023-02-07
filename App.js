import React from 'react';
import {ApplicationProvider, Layout, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {StyleSheet, Platform} from 'react-native';
import Landing from './screens/Landing';
import Home from './screens/Home';
import DistanceGPS from './screens/DistanceGPS';
import AreaGPS from './screens/AreaGPS';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const {Navigator, Screen} = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="landing" component={Landing} />
      <Screen name="home" component={Home} />
      <Screen name="distancegps" component={DistanceGPS} />
      <Screen name="areagps" component={AreaGPS} />
    </Navigator>
  );
};
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <IconRegistry icons={EvaIconsPack} />
      <Layout style={styles.container}>
        <AppNavigator />
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //paddingTop: Platform.OS === 'android' ? 25 : '',
  },
});

export default App;
