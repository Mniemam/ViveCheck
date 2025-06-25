import { Checklist } from '../context/types';
import { Alert } from 'react-native';
import { getRealm } from '../data/realm';

/**
 * Zapisuje listę kontrolną w bazie danych Realm.
 * @param {Checklist} checklist - Obiekt listy kontrolnej do zapisania.
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
    // Alert usunięty: nie wywołuj dialogów w helperach
  }
};

/**
 * Ładuje wszystkie zapisane listy kontrolne z bazy danych Realm.
 * @returns {Promise<Checklist[]>} Obietnica, która zwraca tablicę obiektów list kontrolnych.
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
