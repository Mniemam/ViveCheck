import Realm from 'realm';

export const LocationSchema: Realm.ObjectSchema = {
  name: 'Location',
  properties: {
    latitude: 'double',
    longitude: 'double',
  },
};

export const ChecklistItemSchema: Realm.ObjectSchema = {
  name: 'ChecklistItem',
  embedded: true,
  properties: {
    id: 'string',
    title: 'string',
    completed: 'bool',
    komentarz: 'string?',
    osobaOdpowiedzialna: 'string?',
  },
};

export const ChecklistSchema: Realm.ObjectSchema = {
  name: 'Checklist',
  primaryKey: 'id',
  properties: {
    id: 'string',
    sklep: 'string',
    mr: 'string?',
    prowadzacaZmiane: 'string?',
    prognozaPodstawowy: 'string?',
    prognozaKomplementarny: 'string?',
    skutecznoscChemii: 'string?',
    createdAt: 'date',
    location: 'Location?',
    city: 'string?',
    photoUri: 'string?',
    items: 'ChecklistItem[]',
  },
};

export const TaskSchema: Realm.ObjectSchema = {
  name: 'Task',
  primaryKey: 'id',
  properties: {
    id: 'string',
    checklistId: 'string?',
    title: 'string',
    completed: 'bool',
    photoUris: 'string[]',
    komentarz: 'string?',
    osobaOdpowiedzialna: 'string?',
    category: 'string?',
  },
};
