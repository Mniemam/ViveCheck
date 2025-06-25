import React from 'react';
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const DummyIcon = (props: any) => (
    <View testID={`Ionicons/${props.name}`} />
  );
  return { __esModule: true, Ionicons: DummyIcon };
});
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CompletedChecklistsScreen from '../app/screens/Checklist/CompletedChecklistsScreen';
import { Ionicons } from '@expo/vector-icons';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../src/data/realm', () => ({
  getRealm: jest.fn(),
}));
jest.mock('../src/hooks/useLocation', () => ({
  useCurrentLocation: jest.fn(),
}));
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    __esModule: true,
    ...actual,
    useFocusEffect: (cb: any) => {
      // Wywołaj callback synchronicznie w środowisku testowym
      cb();
      return () => {};
    },
  };
});

const mockRouterPush = jest.fn();
const mockGetLocation = jest.fn();
const mockIsOnline = jest.fn();
const mockSyncChecklistsIfNeeded = jest.fn();


beforeEach(() => {
  jest.clearAllMocks();
  (require('expo-router').useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  (require('../src/hooks/useLocation').useCurrentLocation as jest.Mock).mockReturnValue({ getLocation: mockGetLocation });
});

describe('CompletedChecklistsScreen', () => {
  it('powinien_wyświetlać_posortowane_wykonane_checklisty_po_wejściu_na_ekran', async () => {
    const mockChecklists = [
      { id: '1', sklep: 'Biedronka', createdAt: new Date('2023-01-01'), items: [] },
      { id: '2', sklep: 'Lidl', createdAt: new Date('2023-02-01'), items: [] },
    ];
    const sortedChecklists = [mockChecklists[1], mockChecklists[0]];
    const realmObjects = {
      objects: jest.fn().mockReturnValue({
        sorted: jest.fn().mockReturnValue(sortedChecklists),
        filtered: jest.fn().mockReturnValue([]),
      }),
      isClosed: false,
      close: jest.fn(),
    };
    (require('../src/data/realm').getRealm as jest.Mock).mockResolvedValue(realmObjects);

    const { getByText } = render(
      <NavigationContainer>
        <CompletedChecklistsScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText('Lidl')).toBeTruthy();
      expect(getByText('Biedronka')).toBeTruthy();
    });
  });

  it('powinien_usunąć_checklistę_i_zadania_po_kliknięciu_kosza', async () => {
    const mockChecklist = { id: '1', sklep: 'Biedronka', createdAt: new Date(), items: [] };
    const realmDelete = jest.fn();
    const realmWrite = jest.fn(cb => cb());
    const realmObjects = {
      objects: jest.fn()
        .mockImplementation((model: string) => {
          if (model === 'Checklist') {
            return {
              sorted: jest.fn().mockReturnValue([mockChecklist]),
              filtered: jest.fn().mockReturnValue([mockChecklist]),
            };
          }
          if (model === 'Task') {
            return {
              filtered: jest.fn().mockReturnValue([{ id: 't1' }]),
            };
          }
          return [];
        }),
      objectForPrimaryKey: jest.fn().mockReturnValue(mockChecklist),
      write: realmWrite,
      delete: realmDelete,
      isClosed: false,
      close: jest.fn(),
    };
    (require('../src/data/realm').getRealm as jest.Mock).mockResolvedValue(realmObjects);

    const { getByTestId } = render(
      <NavigationContainer>
        <CompletedChecklistsScreen />
      </NavigationContainer>
    );
    
    // Poczekaj na wyrenderowanie przycisku
    const deleteButton = await waitFor(() => getByTestId('Ionicons/trash-outline'), { timeout: 2000 });
    
    // Kliknij przycisk
    fireEvent.press(deleteButton);

    // Sprawdź czy funkcje zostały wywołane
    await waitFor(() => {
      expect(realmWrite).toHaveBeenCalled();
      expect(realmDelete).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('powinien_uzupełnić_brakujące_pola_miasta_przy_wejściu_na_ekran', async () => {
    const mockChecklistWithMissingCity = {
      id: '1',
      sklep: 'Auchan',
      createdAt: new Date(),
      city: '',
      location: { latitude: 1, longitude: 2 },
      items: [],
    };
    const realmWrite = jest.fn(cb => cb());
    const realmObjects = {
      objects: jest.fn().mockImplementation((model: string) => {
        if (model === 'Checklist') {
          return {
            sorted: jest.fn().mockReturnValue([mockChecklistWithMissingCity]),
            filtered: jest.fn().mockReturnValue([mockChecklistWithMissingCity]),
          };
        }
        return [];
      }),
      write: realmWrite,
      isClosed: false,
      close: jest.fn(),
    };
    (require('../src/data/realm').getRealm as jest.Mock).mockResolvedValue(realmObjects);
    mockGetLocation.mockResolvedValue({ city: 'Warszawa', latitude: 1, longitude: 2 });

    render(
      <NavigationContainer>
        <CompletedChecklistsScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(mockGetLocation).toHaveBeenCalledTimes(1);
      expect(realmWrite).toHaveBeenCalled();
      expect(mockChecklistWithMissingCity.city).toBe('Warszawa');
    });
  });

  it('powinien_wyświetlać_stan_pusty_gdy_brak_checklist', async () => {
    const realmObjects = {
      objects: jest.fn().mockReturnValue({
        sorted: jest.fn().mockReturnValue([]),
        filtered: jest.fn().mockReturnValue([]),
      }),
      isClosed: false,
      close: jest.fn(),
    };
    (require('../src/data/realm').getRealm as jest.Mock).mockResolvedValue(realmObjects);

    const { getByText } = render(
      <NavigationContainer>
        <CompletedChecklistsScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText('Brak wykonanych checklist.')).toBeTruthy();
    });
  });

  it('nie_powinien_aktualizować_miasta_gdy_brak_uprawnień_do_lokalizacji', async () => {
    const mockChecklistWithMissingCity = {
      id: '1',
      sklep: 'Auchan',
      createdAt: new Date(),
      city: '',
      location: { latitude: 1, longitude: 2 },
      items: [],
    };
    const realmWrite = jest.fn(cb => cb());
    const realmObjects = {
      objects: jest.fn().mockImplementation((model: string) => {
        if (model === 'Checklist') {
          return {
            sorted: jest.fn().mockReturnValue([mockChecklistWithMissingCity]),
            filtered: jest.fn().mockReturnValue([mockChecklistWithMissingCity]),
          };
        }
        return [];
      }),
      write: realmWrite,
      isClosed: false,
      close: jest.fn(),
    };
    (require('../src/data/realm').getRealm as jest.Mock).mockResolvedValue(realmObjects);
    mockGetLocation.mockResolvedValue(null);

    render(
      <NavigationContainer>
        <CompletedChecklistsScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(mockGetLocation).toHaveBeenCalled();
      expect(mockChecklistWithMissingCity.city).toBe('');
    });
  });
});