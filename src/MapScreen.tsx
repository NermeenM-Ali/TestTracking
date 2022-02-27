import {StyleSheet, View, Image} from 'react-native';
import React, {forwardRef} from 'react';
import MapView, {Marker} from 'react-native-maps';

const MapScreen = forwardRef(({locationlat, locationlng}: any, ref: any) => {
  return (
    <View style={[styles.map, {backgroundColor: 'white'}]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: locationlat,
          longitude: locationlng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          ref={ref}
          coordinate={{
            latitude: locationlat,
            longitude: locationlng,
          }}>
          <Image
            source={require('./marker.png')}
            style={styles.marker}
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </View>
  );
});

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    width: 400,
    height: 500,
  },
  marker: {
    width: 70,
    height: 70,
  },
});
