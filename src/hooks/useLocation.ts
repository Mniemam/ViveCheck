import * as Location from 'expo-location';

export const useCurrentLocation = () => {
  const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Brak uprawnień do lokalizacji');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  return { getLocation };
};