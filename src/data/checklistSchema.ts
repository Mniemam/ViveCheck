

import { BSON, ObjectSchema } from 'realm';

export const checklistItemSchema: ObjectSchema = {
  name: 'ChecklistItem',
  embedded: true,
  properties: {
    id: 'string',
    title: 'string',
    completed: 'bool',
  },
};

export const checklistSchema: ObjectSchema = {
  name: 'Checklist',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    createdAt: 'date',
    location: 'Location?',
    photoUri: 'string?',
    items: 'ChecklistItem[]',
  },
};

export const locationSchema: ObjectSchema = {
  name: 'Location',
  embedded: true,
  properties: {
    latitude: 'double',
    longitude: 'double',
  },
};