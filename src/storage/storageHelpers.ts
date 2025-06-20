type RealmChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
};

type RealmChecklist = {
  id: string;
  title: string;
  createdAt: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  items: RealmChecklistItem[];
};

import Realm from 'realm';
import {
  LocationSchema,
  ChecklistItemSchema,
  ChecklistSchema,
} from '../context/types';
import { Checklist } from '../context/types';

/**
 * Zapisuje checklistę do bazy Realm
 */
export const saveChecklist = async (checklist: Checklist) => {
  let realm;
  try {
    realm = await Realm.open({
      path: 'checklists.realm',
      schema: [LocationSchema, ChecklistItemSchema, ChecklistSchema],
    });
    realm.write(() => {
      realm.create('Checklist', checklist, Realm.UpdateMode.Modified);
    });
  } catch (error) {
    console.error('Błąd zapisu checklisty:', error);
  } finally {
    realm?.close();
  }
};

/**
 * Pobiera wszystkie zapisane checklisty
 */
export const loadChecklists = async (): Promise<Checklist[]> => {
  let realm;
  try {
    realm = await Realm.open({
      path: 'checklists.realm',
      schema: [LocationSchema, ChecklistItemSchema, ChecklistSchema],
    });
    const data = realm.objects<RealmChecklist>('Checklist');
    const checklists = data.map(item => ({
      id: item.id,
      title: item.title,
      createdAt: item.createdAt,
      location: item.location,
      items: item.items?.map(sub => ({
        id: sub.id,
        title: sub.title,
        completed: sub.completed,
      })) ?? [],
    }));
    return checklists;
  } catch (error) {
    console.error('Błąd odczytu checklist:', error);
    return [];
  } finally {
    realm?.close();
  }
};