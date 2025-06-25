import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ChecklistDetailsScreen from '../app/screens/Checklist/ChecklistDetailsScreen';
import * as realmModule from '../src/data/realm';
import * as routerModule from 'expo-router';
import * as RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// Mocks
jest.mock('../src/data/realm', () => ({
  getRealm: jest.fn(),
}));
jest.mock('expo-router');
jest.mock('react-native-html-to-pdf');
jest.mock('expo-file-system');
jest.mock('expo-sharing');
jest.spyOn(Alert, 'alert');

const mockChecklist = {
  id: '1',
  sklep: 'Test Sklep',
  mr: 'MR Test',
  prowadzacaZmiane: 'Anna',
  prognozaPodstawowy: '80',
  prognozaKomplementarny: '60',
  skutecznoscChemii: '90',
  createdAt: new Date('2024-06-01T12:00:00Z'),
  location: undefined,
  photoUri: '',
  city: 'Warszawa',
  items: [],
};

const mockTask = {
  id: 't1',
  checklistId: '1',
  title: 'Task 1',
  photoUris: ['file:///photo1.jpg'],
  komentarz: 'Komentarz',
  osobaOdpowiedzialna: 'Jan',
  category: 'Kategoria',
};

const mockRouterPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (routerModule.useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
});

describe('ChecklistDetailsScreen', () => {
  it('powinien_wyświetlać_szczegóły_checklisty_gdy_id_jest_poprawne', async () => {
    (realmModule.getRealm as jest.Mock).mockResolvedValue({
      objectForPrimaryKey: jest.fn().mockReturnValue({
        ...mockChecklist,
        createdAt: mockChecklist.createdAt,
      }),
      isClosed: false,
      close: jest.fn(),
    });
    (routerModule.useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });

    const { getByText, getAllByText } = render(<ChecklistDetailsScreen />);
    await waitFor(() => {
      const titles = getAllByText('Szczegóły checklisty');
      expect(titles.length).toBeGreaterThan(0);
      expect(getByText('Test Sklep')).toBeTruthy();
      expect(getByText('Warszawa')).toBeTruthy();
      expect(getByText('MR Test')).toBeTruthy();
      expect(getByText('Anna')).toBeTruthy();
      expect(getByText('80')).toBeTruthy();
      expect(getByText('60')).toBeTruthy();
      expect(getByText('90')).toBeTruthy();
    });
  });

  it('powinien_przejść_do_checklisty_w_trybie_tylko_do_odczytu_po_kliknięciu_przycisku', async () => {
    (realmModule.getRealm as jest.Mock).mockResolvedValue({
      objectForPrimaryKey: jest.fn().mockReturnValue({
        ...mockChecklist,
        createdAt: mockChecklist.createdAt,
      }),
      isClosed: false,
      close: jest.fn(),
    });
    (routerModule.useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });

    const { getByText, getAllByText } = render(<ChecklistDetailsScreen />);
    await waitFor(() => {
      const titles = getAllByText('Szczegóły checklisty');
      expect(titles.length).toBeGreaterThan(1);
    });
    const buttons = getAllByText('Szczegóły checklisty');
    fireEvent.press(buttons[1]);
    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: '/screens/Checklist/CategoryCheckScreen',
      params: { checklistId: '1', readonly: 'true' },
    });
  });

  it('powinien_wyświetlić_błąd_gdy_id_checklisty_jest_niepoprawne', async () => {
    (realmModule.getRealm as jest.Mock).mockResolvedValue({
      objectForPrimaryKey: jest.fn().mockReturnValue(null),
      isClosed: false,
      close: jest.fn(),
    });
    (routerModule.useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'invalid' });

    const { getByText } = render(<ChecklistDetailsScreen />);
    await waitFor(() => {
      expect(getByText('Nie znaleziono checklisty.')).toBeTruthy();
    });
  });
});
