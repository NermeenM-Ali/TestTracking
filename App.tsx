import React, {useRef} from 'react';

import {Platform, Switch, Text, View} from 'react-native';

import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';
import {AnimatedRegion} from 'react-native-maps';
import MapScreen from './src/MapScreen';

const App = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState<any>(
    null,
    // new AnimatedRegion(undefined),
  );
  const markerRef = useRef<any>(null);
  React.useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      location => {
        setLocation(location.coords);
        console.log('[onLocation]', location);
        // if (Platform.OS === 'android') {
        //   if (markerRef) {
        //     markerRef.current?.animateMarkerToCoordinate(location?.coords, 500);
        //   }
        // } else {
        //   // @ts-ignore
        //   location.timing(location.coords).start();
        // }
      },
    );

    // This handler fires on HTTP responses
    const onHttp: Subscription = BackgroundGeolocation.onHttp(response => {
      // console.log('[http] ', response);
    });

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
      event => {
        console.log('[onMotionChange]', event);
        setLocation(event.location.coords);
      },
    );

    const onActivityChange: Subscription =
      BackgroundGeolocation.onActivityChange(event => {
        console.log('[onMotionChange]', event);
      });

    const onProviderChange: Subscription =
      BackgroundGeolocation.onProviderChange(event => {
        console.log('[onProviderChange]', event);
      });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 0.1, // 22l distance el device hym4eha 3l4an y3ml record ll change(bl meter)
      reset: true,
      debug: false, // lw 5letha true hy3ml soot wana bt7rk
      stopOnTerminate: true,
      startOnBoot: true,
      enableHeadless: true,
      // stopOnTerminate: true, // <-- Allow the background-service to continue tracking when user closes the app.
      // startOnBoot: false, // <-- Auto start tracking when device is powered-up.
      maxDaysToPersist: 14,
      geofenceProximityRadius: 50000,
      notification: {
        smallIcon: 'mipmap/ic_notification',
        largeIcon: 'mipmap/logo_smg_white',
        priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN,
        text: 'TestTracking',
        title: '1Trolley',
      },
      disableLocationAuthorizationAlert: true,

      // showsBackgroundLocationIndicator: true,
      // disableMotionActivityUpdates: true,
      // stopOnStationary: true,
      // useSignificantChangesOnly: true, // di lw false hysgl lw m4i 500 to 1000 meter

      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      locationAuthorizationRequest: 'Always',
      headers: {
        // <-- Optional HTTP headers
        'X-FOO': 'bar',
      },
      params: {
        // <-- Optional HTTP params
        auth_token: 'maybe_your_server_authenticates_via_token_YES?',
      },
    }).then(state => {
      setEnabled(state.enabled);
      // to force start tracking userlocation hyb2a ON f7alt "Moving" w OFF f7alt eni mbt7rk4
      BackgroundGeolocation.changePace(state.enabled);
      console.log(
        '- BackgroundGeolocation is configured and ready: ',
        state.enabled,
      );
    });

    return () => {
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
      onHttp.remove();
    };
  }, []);

  /// 3. start / stop BackgroundGeolocation
  React.useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <View style={{alignItems: 'center', backgroundColor: 'white'}}>
      <Text>Click to enable BackgroundGeolocation</Text>
      <Switch value={enabled} onValueChange={setEnabled} />
      <Text style={{fontFamily: 'monospace', fontSize: 12}}>
        {JSON.stringify(location, null, 2)}
      </Text>
      {location ? (
        <MapScreen
          ref={markerRef}
          locationlat={location.latitude}
          locationlng={location.longitude}
        />
      ) : null}
    </View>
  );
};

export default App;
