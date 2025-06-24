import { Checklist } from '../context/types';
import { Alert } from 'react-native';
import { getRealm } from '../data/realm';

/**
 * Zapisuje checklistę do bazy Realm
 */
export const saveChecklist = async (checklist: Checklist) => {
  try {
    const realm = await getRealm();
    realm.write(() => {
      realm.create('Checklist', checklist, true);
    });
    realm.close();
  } catch (error) {
    console.error('Błąd zapisu checklisty:', error, checklist);
    Alert.alert('Błąd zapisu checklisty', String(error));
  }
};

/**
 * Pobiera wszystkie zapisane checklisty
 */
export const loadChecklists = async (): Promise<Checklist[]> => {
  try {
    const realm = await getRealm();
    const raw = realm.objects<any>('Checklist');
    // Mapujemy obiekty Realm na typ Checklist
    return raw.map((item) => ({
      id: item.id,
      sklep: item.sklep,
      mr: item.mr,
      prowadzacaZmiane: item.prowadzacaZmiane,
      prognozaPodstawowy: item.prognozaPodstawowy,
      prognozaKomplementarny: item.prognozaKomplementarny,
      skutecznoscChemii: item.skutecznoscChemii,
      createdAt: item.createdAt,
      location: item.location || { latitude: 0, longitude: 0 },
      photoUri: item.photoUri || '',
      items: item.items.map((sub: any) => ({
        title: sub.title,
        completed: sub.completed,
        komentarz: sub.komentarz || '',
        osobaOdpowiedzialna: sub.osobaOdpowiedzialna || '',
      })),
    }));
  } catch (error) {
    console.error('Błąd odczytu checklist:', error);
    return [];
  }
};
