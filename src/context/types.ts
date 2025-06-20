export type Task = {
  id: string;
  checklistId?: string;
  title: string;
  completed: boolean;
  photoUri?: string;
  description?: string;
  value?: string;
  obszar?: string;
  termin?: string;
  komentarz?: string;
  osobaOdpowiedzialna?: string;
  category?: string;
};


export type Location = {
  latitude: number;
  longitude: number;
};

export const LocationSchema: Realm.ObjectSchema = {
  name: 'Location',
  properties: {
    latitude: 'double',
    longitude: 'double',
  },
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export const ChecklistItemSchema: Realm.ObjectSchema = {
  name: 'ChecklistItem',
  properties: {
    id: 'string',
    text: 'string',
    completed: 'bool',
  },
};

export type Checklist = {
  id: string;
  title: string;
  location: Location;
  items: ChecklistItem[];
};

export const ChecklistSchema: Realm.ObjectSchema = {
  name: 'Checklist',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    location: 'Location',
    items: 'ChecklistItem[]',
  },
};
