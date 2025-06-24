export type Task = {
  id: string;
  checklistId?: string;
  title: string;
  photoUris?: string[];
  description?: string;
  value?: string;
  termin?: string;
  komentarz?: string;
  osobaOdpowiedzialna?: string;
  category?: string;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type ChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
  komentarz?: string;
  osobaOdpowiedzialna?: string;
};

export type Checklist = {
  id: string;
  sklep: string;
  mr?: string;
  prowadzacaZmiane?: string;
  prognozaPodstawowy?: string;
  prognozaKomplementarny?: string;
  skutecznoscChemii?: string;
  createdAt: Date;
  location?: Location;
  photoUri?: string;
  city?: string;
  items: ChecklistItem[];
};
