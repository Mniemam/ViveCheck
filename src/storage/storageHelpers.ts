import { getRealm } from '../data/realm';
import { Checklist } from '../context/types';

/**
 * Zapisuje checklistę do bazy Realm
 */
export const saveChecklist = async (checklist: Checklist) => {
  const realm = await getRealm();
  realm.write(() => {
    realm.create('Checklist', checklist);
  });
  realm.close();
};

/**
 * Pobiera wszystkie zapisane checklisty
 */
export const loadChecklists = async (): Promise<Checklist[]> => {
  const realm = await getRealm();

  type RealmChecklistItem = {
    id: string;
    title: string;
    completed: boolean;
  };

  type RealmChecklist = {
    id: string;
    title: string;
    createdAt: Date;
    photoUri?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    items: RealmChecklistItem[];
  };

  const data = realm.objects<RealmChecklist>('Checklist');
  const checklists = data.map(item => ({
    id: item.id,
    title: item.title,
    createdAt: item.createdAt,
    photoUri: item.photoUri,
    location: item.location,
    items: item.items.map(sub => ({
      id: sub.id,
      title: sub.title,
      completed: sub.completed,
    })),
  }));

  realm.close();
  return checklists;
};