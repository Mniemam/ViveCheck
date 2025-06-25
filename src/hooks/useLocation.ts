import * as Location from 'expo-location';

/**
 * Niestandardowy hak do pobierania bieżącej lokalizacji użytkownika.
 * @returns {{getLocation: () => Promise<{latitude: number, longitude: number, city: string} | null>}} Obiekt zawierający funkcję `getLocation`.
 */
export const useCurrentLocation = () => {
  const getLocation = async (): Promise<{
    latitude: number;
    longitude: number;
    city: string;
  } | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Brak uprawnień do lokalizacji');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    let city = '';
    try {
      const reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      city = reverse[0]?.city || reverse[0]?.region || reverse[0]?.subregion || '';
    } catch (err) {
      console.warn('Native reverse geocoding failed:', err);
      // Fallback to Nominatim HTTP lookup
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`,
        );
        const data = await resp.json();
        city = data.address.city || data.address.town || data.address.village || '';
      } catch (httpErr) {
        console.warn('Fallback reverse geocoding failed:', httpErr);
      }
    }

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      city,
    };
  };

  return { getLocation };
};
