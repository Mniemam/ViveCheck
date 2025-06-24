// src/storage/fileHelpers.ts

import * as FileSystem from 'expo-file-system';
// import { Platform } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';

const PHOTO_DIR = `${FileSystem.documentDirectory}photos/`;

/**
 * Kopiuje zdjęcie podane przez URI do wewnętrznego folderu aplikacji
 * i zwraca nową ścieżkę pliku.
 */
export async function savePhotoToAppDirectory(uri: string): Promise<string | null> {
  try {
    // Upewnij się, że katalog istnieje
    const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
    }

    // NIE usuwaj file:// z uri źródłowego – FileSystem.copyAsync wymaga pełnego URI
    const rawName = uri.split('/').pop() ?? `${Date.now()}`;
    const ext = (rawName && rawName.includes('.') && rawName.split('.').pop()) || 'jpg';
    // Unikalna nazwa pliku bez uuid (kompatybilna z React Native)
    const fileName = `photo_${Date.now()}_${Math.floor(Math.random() * 1e6)}.${ext}`;
    const destUri = PHOTO_DIR + fileName;

    // Logowanie ścieżek dla debugowania
    console.log('Kopiowanie zdjęcia z:', uri, 'do:', destUri);

    // Sprawdź, czy plik źródłowy istnieje
    const srcInfo = await FileSystem.getInfoAsync(uri);
    if (!srcInfo.exists) {
      console.error('Plik źródłowy nie istnieje:', uri);
      return null;
    }

    // Skopiuj plik
    await FileSystem.copyAsync({
      from: uri,
      to: destUri,
    });

    // Zwróć ujednolicony URI z prefiksem file:// na wszystkich platformach
    // Usuń podwójny file:// jeśli już jest
    let resultUri = destUri;
    if (!resultUri.startsWith('file://')) {
      resultUri = `file://${resultUri}`;
    }
    return resultUri;
  } catch (error) {
    console.error('Błąd przy zapisie zdjęcia:', error, 'Dla uri:', uri);
    throw new Error(`savePhotoToAppDirectory failed for ${uri}: ${error}`);
  }
}
