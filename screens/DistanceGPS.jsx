import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {Text, Layout, Button} from '@ui-kitten/components';
import Geolocation from 'react-native-geolocation-service';
import {
  computeArea,
  LatLng,
  computeDistanceBetween,
} from 'spherical-geometry-js/src/index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

const DistanceGPS = () => {
  const [showTip, setShowTip] = useState(null);
  const [error, setError] = useState(null);
  const [position1, setPosition1] = useState(null);
  const [position2, setPosition2] = useState(null);
  const [distance, setDistance] = useState(null);
  const [disableButton1, setDisableButton1] = useState(false);
  const [disableButton2, setDisableButton2] = useState(true);
  const [disableButton3, setDisableButton3] = useState(true);

  //display tip after one second on render screen
  useEffect(() => {
    const displayTip = () => {
      setShowTip(true);
    };
    setTimeout(displayTip, 1000);
  }, []);

  // function to get Location of position1
  const getPosition1 = async () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log('p1', position);
            setPosition1(position);
            //update UI
            setDisableButton1(true);
            setDisableButton2(false);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setError(true);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });

    console.log('pos1', position1);
  };

  // function to get Location of position2
  const getPosition2 = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log('p2', position);
            setPosition2(position);
            setDisableButton2(true);
            setDisableButton3(false);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setError(true);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });

    console.log('pos2', position2);
  };

  //calculate distance
  const calculateDistance = () => {
    var loc1 = new LatLng(
      position1.coords.latitude,
      position1.coords.longitude,
    );
    var loc2 = new LatLng(
      position2.coords.latitude,
      position2.coords.longitude,
    );
    const dist = computeDistanceBetween(loc1, loc2);
    setDistance(dist);
    console.log(dist, 'distance'); // in meters
  };

  //restart process
  const restartProcess = () => {
    setPosition1(null);
    setPosition2(null);
    setDisableButton1(false);
    setDisableButton2(true);
    setDisableButton3(true);
    setDistance(null);
    setShowTip(true);
  };

  return (
    <Layout style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {showTip && (
          <View
            style={{
              borderWidth: 0.5,
              borderColor: 'white',
              borderRadius: 5,
              backgroundColor: 'orange',
            }}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity onPress={() => setShowTip(false)}>
                <View style={{padding: 10}}>
                  <MaterialIcons name="clear" size={25} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={{padding: 10, fontWeight: 'bold'}}>
              For a better experience and near accurate results, turn on device
              location. Your device will need to use GPS, Wi-Fi, mobile networks
              and sensors.
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <View>
            <Entypo name="location" size={20} color="brown" />
          </View>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Mark Positions</Text>
        </View>
        <View style={styles.positionContainer}>
          <Button disabled={disableButton1} onPress={getPosition1}>
            POSITION 1
          </Button>
          <View style={{paddingTop: 15}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Latitude:{' '}
              {position1 ? (
                <Text status="success">{position1.coords.latitude}</Text>
              ) : (
                <Text style={{color: 'brown'}}>null</Text>
              )}
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Longitude:{' '}
              {position1 ? (
                <Text status="success">{position1.coords.longitude}</Text>
              ) : (
                <Text style={{color: 'brown'}}>null</Text>
              )}
            </Text>
          </View>
        </View>
        <View style={styles.positionContainer}>
          <Button disabled={disableButton2} onPress={getPosition2}>
            POSITION 2
          </Button>
          <View style={{paddingTop: 15}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Latitude:{' '}
              {position2 ? (
                <Text status="success">{position2.coords.latitude}</Text>
              ) : (
                <Text style={{color: 'brown'}}>null</Text>
              )}
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Longitude:{' '}
              {position2 ? (
                <Text status="success">{position2.coords.longitude}</Text>
              ) : (
                <Text style={{color: 'brown'}}>null</Text>
              )}
            </Text>
          </View>
        </View>
        <View>
          <Button disabled={disableButton3} onPress={calculateDistance}>
            GET DISTANCE
          </Button>
          <View
            style={{
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons name="approximately-equal" size={25} />
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              {distance && `${distance} M`}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={restartProcess}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 65,
            }}>
            <View>
              <MaterialCommunityIcons name="restart" size={35} color="orange" />
            </View>
            <Button
              appearance="ghost"
              status="warning"
              size="large"
              onPress={restartProcess}>
              Restart process
            </Button>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    paddingTop: Platform.OS == 'android' ? 28 : 0,
    paddingHorizontal: 25,
    //justifyContent: 'center',
  },
  positionContainer: {
    marginVertical: 20,
    padding: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default DistanceGPS;
