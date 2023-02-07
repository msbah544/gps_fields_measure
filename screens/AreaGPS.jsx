import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {Layout, Text, Button} from '@ui-kitten/components';
import Geolocation from 'react-native-geolocation-service';
import {computeArea, LatLng} from 'spherical-geometry-js/src/index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

const Area2 = () => {
  const [showTip, setShowTip] = useState(null);
  const [error, setError] = useState(null);
  const [pos, setPos] = useState(null);
  const [area, setArea] = useState(null);
  const [disableAreaButton, setDisableAreaButton] = useState(false);
  const [positionsArray, setPositionsArray] = useState([]);

  //display tip after one second on render screen
  useEffect(() => {
    const displayTip = () => {
      setShowTip(true);
    };
    setTimeout(displayTip, 1000);
  }, []);

  // function to get Location of position
  const getPosition = async () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log('p', position);
            setPos(position);
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

    console.log('pos', pos);
  };

  //useEffect hook
  useEffect(() => {
    if (pos !== null) {
      setPositionsArray([
        ...positionsArray,
        {
          lat: pos && pos.coords.latitude,
          lng: pos && pos.coords.longitude,
        },
      ]);
    }
    console.log(positionsArray);
    if (positionsArray.length <= 1) {
      return setDisableAreaButton(true);
    } else {
      return setDisableAreaButton(false);
    }
  }, [pos]);

  //calculate distance
  const calculateArea = async () => {
    if (positionsArray) {
      //console.log(positionsArray.length, positionsArray[3]);
      //convert coords to latlng
      var latLngs = positionsArray.map(function (coord) {
        return new LatLng(coord.lat, coord.lng);
      });
    }

    const result = computeArea(latLngs); //return the area
    console.log(result, 'area'); //in square meters
    setArea(result);
  };

  //restart process
  const restartProcess = () => {
    setPos(null);
    setArea(null);
    setPositionsArray([]);
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
        <View style={styles.positionContainer}>
          <Button onPress={getPosition}>
            GET POSITION {positionsArray.length + 1}
          </Button>
          <Text>
            Positions marked{' '}
            <Text status="success">{positionsArray.length}</Text>
          </Text>
          <View style={{paddingTop: 15}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Latitude:{' '}
              {pos ? (
                <Text status="success">{pos.coords.latitude}</Text>
              ) : (
                <Text style={{color: 'brown'}}>null</Text>
              )}
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Longitude:{' '}
              {pos ? (
                <Text status="success">{pos.coords.longitude}</Text>
              ) : (
                <Text style={{color: 'brown'}}>null</Text>
              )}
            </Text>
          </View>
        </View>

        <View>
          <Button disabled={disableAreaButton} onPress={calculateArea}>
            GET AREA
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
              {area && `${area} meter square`}
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
              <MaterialCommunityIcons name="restart" size={30} color="orange" />
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

export default Area2;
