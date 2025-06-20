

import * as ImagePicker from 'expo-image-picker';
import { savePhotoToAppDirectory } from '../storage/fileHelpers';

/**
 * Hook do wykonania zdjęcia i zapisania go lokalnie
 */
export const useCameraCapture = () => {
  const takePhoto = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      console.warn('Brak uprawnień do kamery');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      const savedUri = await savePhotoToAppDirectory(photoUri);
      return savedUri;
    }

    return null;
  };

  return { takePhoto };
};