import { savePhotoToAppDirectory } from '../src/storage/fileHelpers';
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mocked_directory/',
  getInfoAsync: jest.fn(async (uri) => ({ exists: uri.includes('test_photo') || uri.includes('photos'), isDirectory: uri.includes('photos') })),
  writeAsStringAsync: jest.fn(async () => {}),
  deleteAsync: jest.fn(async () => {}),
  makeDirectoryAsync: jest.fn(async () => {}),
  copyAsync: jest.fn(async ({ from, to }) => {
    if (from.includes('test_photo4')) {
      throw new Error('File not found');
    }
    return;
  }),
}));

import * as FileSystem from 'expo-file-system';

describe('savePhotoToAppDirectory', () => {
  const PHOTO_DIR = `${FileSystem.documentDirectory}photos/`;

  afterEach(async () => {
    // Sprzątanie: usuń katalog ze zdjęciami, jeśli istnieje
    const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(PHOTO_DIR, { idempotent: true });
    }
  });

  it('powinien_zapisać_zdjęcie_gdy_katalog_nie_istnieje', async () => {
    // Upewnij się, że katalog nie istnieje
    const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(PHOTO_DIR, { idempotent: true });
    }

    // Utwórz tymczasowy plik źródłowy
    const srcUri = `${FileSystem.documentDirectory}test_photo.jpg`;
    await FileSystem.writeAsStringAsync(srcUri, 'dummy image data');
    console.log('Plik źródłowy utworzony:', srcUri);

    const resultUri = await savePhotoToAppDirectory(srcUri);

    expect(resultUri).toBeTruthy();
    const savedInfo = await FileSystem.getInfoAsync(resultUri!);
    expect(savedInfo.exists).toBe(true);

    // Sprzątanie
    await FileSystem.deleteAsync(srcUri, { idempotent: true });
    await FileSystem.deleteAsync(resultUri!, { idempotent: true });
  });

  it('powinien_zapisać_zdjęcie_gdy_katalog_istnieje', async () => {
    // Upewnij się, że katalog istnieje
    const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
    }

    // Utwórz tymczasowy plik źródłowy
    const srcUri = `${FileSystem.documentDirectory}test_photo2.jpg`;
    await FileSystem.writeAsStringAsync(srcUri, 'dummy image data 2');

    const resultUri = await savePhotoToAppDirectory(srcUri);

    expect(resultUri).toBeTruthy();
    const savedInfo = await FileSystem.getInfoAsync(resultUri!);
    expect(savedInfo.exists).toBe(true);

    // Sprzątanie
    await FileSystem.deleteAsync(srcUri, { idempotent: true });
    await FileSystem.deleteAsync(resultUri!, { idempotent: true });
  });

  it('powinien_zwrócić_uri_z_prefiksem_file', async () => {
    const srcUri = `${FileSystem.documentDirectory}test_photo3.jpg`;
    await FileSystem.writeAsStringAsync(srcUri, 'dummy image data 3');

    const resultUri = await savePhotoToAppDirectory(srcUri);

    expect(resultUri).toBeTruthy();
    expect(resultUri!.startsWith('file://')).toBe(true);

    // Sprzątanie
    await FileSystem.deleteAsync(srcUri, { idempotent: true });
    await FileSystem.deleteAsync(resultUri!, { idempotent: true });
  });

  it('powinien_zwrócić_null_gdy_plik_źródłowy_brak', async () => {
    const missingUri = `${FileSystem.documentDirectory}nonexistent_photo.jpg`;
    const result = await savePhotoToAppDirectory(missingUri);
    expect(result).toBeNull();
  });

  it('powinien_rzucić_błąd_gdy_kopiowanie_zawiedzie', async () => {
    // Utwórz tymczasowy plik źródłowy
    const srcUri = `${FileSystem.documentDirectory}test_photo4.jpg`;
    await FileSystem.writeAsStringAsync(srcUri, 'dummy image data 4');

    // Ustaw katalog docelowy jako tylko do odczytu, aby wymusić błąd kopiowania (jeśli to możliwe)
    // Jeśli to niemożliwe, użyj nieprawidłowej ścieżki docelowej
    const originalPhotoDir = `${FileSystem.documentDirectory}photos/`;
    const invalidPhotoDir = `/invalid_path/photos/`;

    // Tymczasowo nadpisz PHOTO_DIR dla tego testu
    const originalPhotoDirValue = (global as any).PHOTO_DIR;
    (global as any).PHOTO_DIR = invalidPhotoDir;

    let errorCaught = false;
    try {
      await savePhotoToAppDirectory(srcUri);
    } catch (e: any) {
      errorCaught = true;
      expect(e.message).toMatch(/savePhotoToAppDirectory failed/);
    }

    expect(errorCaught).toBe(true);

    // Przywróć PHOTO_DIR
    (global as any).PHOTO_DIR = originalPhotoDirValue;

    // Sprzątanie
    await FileSystem.deleteAsync(srcUri, { idempotent: true });
  });

  it('powinien_obsłużyć_uri_z_prefiksem_lub_bez', async () => {
    // Utwórz tymczasowy plik źródłowy
    const srcUri = `${FileSystem.documentDirectory}test_photo5.jpg`;
    await FileSystem.writeAsStringAsync(srcUri, 'dummy image data 5');

    // Test z prefiksem file://
    const filePrefixedUri = srcUri.startsWith('file://') ? srcUri : `file://${srcUri}`;
    const resultWithPrefix = await savePhotoToAppDirectory(filePrefixedUri);
    expect(resultWithPrefix).toBeTruthy();
    expect(resultWithPrefix!.startsWith('file://')).toBe(true);

    // Test bez prefiksu file://
    const uriWithoutPrefix = srcUri.replace(/^file:\/\//, '');
    const resultWithoutPrefix = await savePhotoToAppDirectory(uriWithoutPrefix);
    expect(resultWithoutPrefix).toBeTruthy();
    expect(resultWithoutPrefix!.startsWith('file://')).toBe(true);

    // Sprzątanie
    await FileSystem.deleteAsync(srcUri, { idempotent: true });
    if (resultWithPrefix) await FileSystem.deleteAsync(resultWithPrefix, { idempotent: true });
    if (resultWithoutPrefix) await FileSystem.deleteAsync(resultWithoutPrefix, { idempotent: true });
  });
});