import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Button, Text, Layout, Icon, Card, Divider} from '@ui-kitten/components';
import MapView, {Polyline, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {FloatingAction} from 'react-native-floating-action';
import {
  computeArea,
  LatLng,
  computeDistanceBetween,
} from 'spherical-geometry-js/src/index';
import {Menu, MenuItem, Modal} from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

//floating actions
const actions = [
  {
    text: 'Calculate Distance',
    icon: (
      <MaterialCommunityIcons
        name="map-marker-distance"
        size={25}
        color="white"
      />
    ),
    name: 'distance',
    position: 1,
  },
  {
    text: 'Show My Location',
    icon: <MaterialIcons name="my-location" size={25} color="white" />,
    name: 'location',
    position: 2,
  },
  {
    text: 'Calculate Area/Size ',
    icon: <FontAwesome5 name="draw-polygon" size={25} color="white" />,
    name: 'area',
    position: 3,
  },
];
//Icons
const GpsIcon = props => <Icon {...props} name="radio-outline" />;
const ManualIcon = props => <Icon {...props} name="activity-outline" />;

const Map = ({navigation}) => {
  const [location, setLocation] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [visible, setVisible] = React.useState();
  const [area, setArea] = useState(false);
  const [distance, setDistance] = useState(false);

  // function to get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 9000},
        );
      }
    });

    console.log(location);
  };
  //get location on render map screen
  useEffect(() => {
    getLocation();
    setTimeout(() => setShowTip(true), 10000);
  }, []);

  const coordinates = [
    {latitude: 13.443617572262783, longitude: -16.718836091458797},
    {latitude: 13.444978665069168, longitude: -16.718215495347977},
  ];

  return (
    <Layout style={styles.MainContainer}>
      {location ? (
        <MapView
          onPress={e => console.log(e.nativeEvent.coordinate)}
          style={styles.mapStyle}
          provider="google"
          mapType="hybrid"
          showsUserLocation={true}
          zoomEnabled={true}
          zoomControlEnabled={false}
          showsScale={true}
          showsCompass={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: location && location.coords.latitude,
            longitude: location && location.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          <Marker coordinate={coordinates[0]} />
          <Marker coordinate={coordinates[1]} />
          <Polyline
            style={{flex: 1, position: 'absolute'}}
            coordinates={coordinates}
            strokeColor="#5798F9" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={3}
          />
          {/**=============MODAL============= */}
          <Modal
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setVisible(false)}>
            <Card disabled={true} style={{position: 'absolute'}}>
              <Layout>
                <Text category="h6">Choose Mode</Text>
              </Layout>
              <MenuItem
                title="Measuring by GPS"
                accessoryLeft={GpsIcon}
                onPress={() => {
                  if (area) {
                    setVisible(!visible);
                    return navigation.navigate('areagps');
                  } else {
                    if (distance) {
                      setVisible(!visible);
                      return navigation.navigate('distancegps');
                    }
                  }
                }}
              />
              <MenuItem
                title="Measuring by Manual"
                accessoryLeft={ManualIcon}
              />
            </Card>
          </Modal>
          {/* =============MODAL_End============= */}
        </MapView>
      ) : (
        <Layout style={{position: 'absolute', top: 300}}>
          <View style={{}}>
            <ActivityIndicator color={`orange`} size={50} />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold'}}>Loading Map ...</Text>
            </View>
          </View>
          {showTip && (
            <Layout
              style={{
                padding: 35,
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <FontAwesome5
                  name="exclamation-circle"
                  size={25}
                  color="orange"
                />
              </View>
              <Text style={{fontWeight: 'bold'}}>
                If Loading Map is taking too long. check to make sure that
                location service / gps is enabled and device is connected to the
                internet.
                <Text style={{fontWeight: 'bold', color: 'blue'}}>
                  GPS / Location service must be enabled to view Map!
                </Text>
              </Text>
              <View
                style={{
                  paddingTop: 20,
                }}>
                <Button onPress={getLocation}>Enable gps / view map</Button>
              </View>
            </Layout>
          )}
        </Layout>
      )}

      <FloatingAction
        actions={actions}
        onPressItem={name => {
          console.log(`selected button: ${name}`);
          if (name === 'location') {
            //get location
            getLocation();
            console.log(location);
          } else if (name === 'area') {
            setArea(true);
            setDistance(false);
            //show modal
            setVisible(!visible);
          } else if (name === 'distance') {
            setArea(false);
            setDistance(true);
            //show modal
            setVisible(!visible);
          }
        }}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    flex: 1,
    margin: 8,
  },
});

export default Map;
