import React, {useEffect} from 'react';
import {PropsWithChildren} from 'react';
import {AppState} from 'react-native';
import {usePermissionStore} from '../store/permissions/usePermissionStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../navigation/StackNavigator';

export const PermissionsChecker = ({children}: PropsWithChildren) => {
  const {locationStatus, checkLocationPermission} = usePermissionStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useEffect(() => {
    if (locationStatus === 'granted') {
      navigation.reset({
        routes: [{name: 'MapScreen'}],
      });
    } else if (locationStatus !== 'undetermined') {
      navigation.reset({
        routes: [{name: 'PermissionsScreen'}],
      });
    }
  }, [locationStatus, navigation]);

  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkLocationPermission]);

  return <>{children}</>;
};
