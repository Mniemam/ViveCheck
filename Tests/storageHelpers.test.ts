jest.mock('../src/data/realm', () => {
  const store: Record<string, any[]> = { Checklist: [] };
  const fakeRealm = {
    write: (cb: Function) => {
      cb();
    },
    create: (type: string, data: any) => {
      store[type].push({ ...data });
    },
    objects: (type: string) => {
      const arr = store[type];
      // Dodaj metodę filtered do tablicy
      // @ts-ignore
      arr.filtered = (_query: string, id: any) => arr.filter((item) => item.id === id);
      return arr;
    },
    delete: (items: any[]) => {
      items.forEach((item) => {
        const idx = store['Checklist'].indexOf(item);
        if (idx !== -1) store['Checklist'].splice(idx, 1);
      });
    },
    close: jest.fn(),
  };
  return {
    getRealm: jest.fn().mockResolvedValue(fakeRealm),
  };
});
import { saveChecklist, loadChecklists } from '../src/storage/storageHelpers';
import { getRealm } from '../src/data/realm';
import { Checklist } from '../src/context/types';

describe('saveChecklist', () => {
  it('powinien_zapisać_poprawną_checklistę_do_bazy', async () => {
    // Przygotuj poprawny obiekt checklisty
    const checklist: Checklist = {
      id: 'test-id',
      sklep: 'Test Sklep',
      createdAt: new Date(),
      items: [],
    };

    // Pobierz instancję Realm
    const realm = await getRealm();

    // Usuń istniejące checklisty o tym samym id
    realm.write(() => {
      const existing = realm.objects('Checklist').filtered('id == $0', checklist.id);
      if (existing.length > 0) {
        realm.delete(existing);
      }
    });

    // Zapisz checklistę
    await saveChecklist(checklist);

    // Wyszukaj checklistę w bazie
    const saved = realm.objects('Checklist').filtered('id == $0', checklist.id);

    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe(checklist.id);
    expect(saved[0].sklep).toBe(checklist.sklep);

    // Sprzątanie po teście
    realm.write(() => {
      realm.delete(saved);
    });

    realm.close();
  });

  it('powinien_wczytać_i_odmapować_wszystkie_checklisty_poprawnie', async () => {
    const realm = await getRealm();

    // Przygotuj dane testowe
    const checklistData = {
      id: 'test-checklist-id',
      sklep: 'Test Sklep',
      mr: 'Test MR',
      prowadzacaZmiane: 'Test Prowadzaca',
      prognozaPodstawowy: 'Test Podstawowy',
      prognozaKomplementarny: 'Test Komplementarny',
      skutecznoscChemii: 'Test Chemii',
      createdAt: new Date(),
      location: { latitude: 12.34, longitude: 56.78 },
      photoUri: 'test/photo/uri.jpg',
      items: [
        {
          title: 'Item 1',
          completed: true,
          komentarz: 'Komentarz 1',
          osobaOdpowiedzialna: 'Osoba 1',
        },
        {
          title: 'Item 2',
          completed: false,
          // komentarz i osobaOdpowiedzialna celowo pominięte, aby przetestować wartości domyślne
        },
      ],
    };

    // Usuń istniejące checklisty o tym samym id
    realm.write(() => {
      const existing = realm.objects('Checklist').filtered('id == $0', checklistData.id);
      if (existing.length > 0) {
        realm.delete(existing);
      }
    });

    // Realm może wymagać, aby items było listą obiektów
    realm.write(() => {
      realm.create('Checklist', {
        ...checklistData,
        // Realm może wymagać, aby items było listą obiektów
        items: checklistData.items,
      });
    });

    // Uruchom funkcję podlegającą testowi
    const checklists = await loadChecklists();

    // Znajdź wstawioną checklistę
    const loaded = checklists.find((c) => c.id === checklistData.id);

    expect(loaded).toBeDefined();
    expect(loaded!.sklep).toBe(checklistData.sklep);
    expect(loaded!.mr).toBe(checklistData.mr);
    expect(loaded!.prowadzacaZmiane).toBe(checklistData.prowadzacaZmiane);
    expect(loaded!.prognozaPodstawowy).toBe(checklistData.prognozaPodstawowy);
    expect(loaded!.prognozaKomplementarny).toBe(checklistData.prognozaKomplementarny);
    expect(loaded!.skutecznoscChemii).toBe(checklistData.skutecznoscChemii);
    expect(new Date(loaded!.createdAt).getTime()).toBe(checklistData.createdAt.getTime());
    expect(loaded!.location).toEqual(checklistData.location);
    expect(loaded!.photoUri).toBe(checklistData.photoUri);

    expect(loaded!.items.length).toBe(2);
    expect(loaded!.items[0].title).toBe('Item 1');
    expect(loaded!.items[0].completed).toBe(true);
    expect(loaded!.items[0].komentarz).toBe('Komentarz 1');
    expect(loaded!.items[0].osobaOdpowiedzialna).toBe('Osoba 1');
    expect(loaded!.items[1].title).toBe('Item 2');
    expect(loaded!.items[1].completed).toBe(false);
    expect(loaded!.items[1].komentarz).toBe(''); // default
    expect(loaded!.items[1].osobaOdpowiedzialna).toBe(''); // default

    // Sprzątanie po teście
    realm.write(() => {
      const inserted = realm.objects('Checklist').filtered('id == $0', checklistData.id);
      if (inserted.length > 0) {
        realm.delete(inserted);
      }
    });

    realm.close();
  });
});
