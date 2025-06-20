import Realm from 'realm';

export const ChecklistSchema = {
  name: 'Checklist',
  primaryKey: 'id',
  properties: {
    id: 'string',
    sklep: 'string',
    category: 'string?',
    data: 'string?',
    mr: 'string?',
    prowadzacaZmiane: 'string?',
    prognozaPodstawowy: 'string?',
    prognozaKomplementarny: 'string?',
    skutecznoscChemii: 'string?',
    createdAt: 'date',
  },
};

export type Checklist = {
  id: string;
  sklep: string;
  category?: string;
  data?: string;
  mr?: string;
  prowadzacaZmiane?: string;
  prognozaPodstawowy?: string;
  prognozaKomplementarny?: string;
  skutecznoscChemii?: string;
  createdAt: Date;
};
