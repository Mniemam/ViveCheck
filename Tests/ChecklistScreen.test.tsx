import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ChecklistaFormScreen from '../app/screens/Checklist/ChecklistScreen';
import { Alert } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));
jest.mock('../src/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));
jest.mock('../src/data/realm', () => ({
  getRealm: jest.fn(),
}));
jest.mock('../src/data/categories', () => ({
  initialCategories: [
    {
      title: 'Test Category',
      tasks: [{ id: '1', title: 'Test Task', komentarz: '', osobaOdpowiedzialna: '' }],
    },
  ],
}));
jest.mock('../src/hooks/useLocation', () => ({
  useCurrentLocation: jest.fn(),
}));

const mockPush = jest.fn();
const mockAlert = jest.spyOn(Alert, 'alert');

beforeEach(() => {
  jest.clearAllMocks();
  (require('expo-router').useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (require('../src/data/realm').getRealm as jest.Mock).mockResolvedValue({
    write: jest.fn((fn) => fn()),
    create: jest.fn(),
    objectForPrimaryKey: jest.fn(),
    close: jest.fn(),
    isClosed: false,
  });
  (require('../src/hooks/useLocation').useCurrentLocation as jest.Mock).mockReturnValue({
    getLocation: jest.fn().mockResolvedValue({ latitude: 10, longitude: 20, city: 'TestCity' }),
  });
});

describe('ChecklistaFormScreen', () => {
  it('powinien_utworzyć_checklistę_z_prawidłowymi_danymi_i_lokalizacją', async () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({});
    (require('../src/context/AppContext').useAppContext as jest.Mock).mockReturnValue({
      state: { checklists: [] },
    });

    const rendered = render(<ChecklistaFormScreen />);
    const { getByPlaceholderText, getByText, getAllByDisplayValue } = rendered;

    await waitFor(() => getByText('KARTA WIZYTY'));

    fireEvent.changeText(getByPlaceholderText('np. VP123'), 'VP999');
    fireEvent.changeText(getByPlaceholderText('np. Jan Kowalski'), 'Jan Nowak');
    fireEvent.changeText(getByPlaceholderText('Imię i nazwisko'), 'Anna Testowa');
    const numericInputs = getAllByDisplayValue('');
    fireEvent.changeText(numericInputs[0], '80');
    fireEvent.changeText(numericInputs[1], '60');
    fireEvent.changeText(numericInputs[2], '90');

    const nextButton = getByText('Dalej →');
    await act(async () => {
      fireEvent.press(nextButton);
    });

    expect(require('../src/data/realm').getRealm).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '../Checklist/CategoryCheckScreen',
        params: expect.objectContaining({
          sklep: 'VP999',
          mr: 'Jan Nowak',
          prowadzacaZmiane: 'Anna Testowa',
          prognozaPodstawowy: '80',
          prognozaKomplementarny: '60',
          skutecznoscChemii: '90',
        }),
      }),
    );
  });

  it('powinien_wyświetlić_pola_tylko_do_odczytu_w_trybie_podglądu', async () => {
    const checklist = {
      id: 'abc123',
      sklep: 'VP777',
      mr: 'MR Test',
      prowadzacaZmiane: 'Prowadzaca',
      prognozaPodstawowy: '50',
      prognozaKomplementarny: '30',
      skutecznoscChemii: '70',
      createdAt: new Date(),
      location: { latitude: 1, longitude: 2 },
      city: 'MiastoTest',
      items: [],
    };
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'abc123',
    });
    (require('../src/context/AppContext').useAppContext as jest.Mock).mockReturnValue({
      state: { checklists: [checklist] },
    });

    const { getByDisplayValue, getByText } = render(<ChecklistaFormScreen />);

    expect(getByDisplayValue('VP777').props.editable).toBe(false);
    expect(getByDisplayValue('MR Test').props.editable).toBe(false);
    expect(getByDisplayValue('Prowadzaca').props.editable).toBe(false);
    expect(getByDisplayValue('50').props.editable).toBe(false);
    expect(getByDisplayValue('30').props.editable).toBe(false);
    expect(getByDisplayValue('70').props.editable).toBe(false);

    expect(getByText('1, 2')).toBeTruthy();
    expect(getByText('MiastoTest')).toBeTruthy();
  });

  it('powinien_przejść_do_następnego_ekranu_po_zapisaniu_checklisty', async () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({});
    (require('../src/context/AppContext').useAppContext as jest.Mock).mockReturnValue({
      state: { checklists: [] },
    });

    const rendered = render(<ChecklistaFormScreen />);
    const { getByPlaceholderText, getByText, getAllByDisplayValue } = rendered;

    await waitFor(() => getByText('KARTA WIZYTY'));

    fireEvent.changeText(getByPlaceholderText('np. VP123'), 'VP123');
    fireEvent.changeText(getByPlaceholderText('np. Jan Kowalski'), 'Jan Kowalski');
    fireEvent.changeText(getByPlaceholderText('Imię i nazwisko'), 'Prowadzaca');
    const numericInputs = getAllByDisplayValue('');
    fireEvent.changeText(numericInputs[0], '10');
    fireEvent.changeText(numericInputs[1], '20');
    fireEvent.changeText(numericInputs[2], '30');

    const nextButton = getByText('Dalej →');
    await act(async () => {
      fireEvent.press(nextButton);
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '../Checklist/CategoryCheckScreen',
        params: expect.objectContaining({
          sklep: 'VP123',
        }),
      }),
    );
  });

  it('powinien_pokazać_błąd_dla_niepoprawnego_id_checklisty_w_trybie_podglądu', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'notfound',
    });
    (require('../src/context/AppContext').useAppContext as jest.Mock).mockReturnValue({
      state: { checklists: [] },
    });

    const { getByText } = render(<ChecklistaFormScreen />);
    expect(getByText('Błąd: nie znaleziono danych.')).toBeTruthy();
  });

  it('powinien_pokazać_alert_i_kontynuować_gdy_lokalizacja_jest_niedostępna', async () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({});
    (require('../src/context/AppContext').useAppContext as jest.Mock).mockReturnValue({
      state: { checklists: [] },
    });
    (require('../src/hooks/useLocation').useCurrentLocation as jest.Mock).mockReturnValue({
      getLocation: jest.fn().mockResolvedValue(null),
    });

    const rendered = render(<ChecklistaFormScreen />);
    const { getByPlaceholderText, getByText, getAllByDisplayValue } = rendered;

    await waitFor(() => getByText('KARTA WIZYTY'));

    fireEvent.changeText(getByPlaceholderText('np. VP123'), 'VP123');
    fireEvent.changeText(getByPlaceholderText('np. Jan Kowalski'), 'Jan Kowalski');
    fireEvent.changeText(getByPlaceholderText('Imię i nazwisko'), 'Prowadzaca');
    const numericInputs = getAllByDisplayValue('');
    fireEvent.changeText(numericInputs[0], '10');
    fireEvent.changeText(numericInputs[1], '20');
    fireEvent.changeText(numericInputs[2], '30');

    const nextButton = getByText('Dalej →');
    await act(async () => {
      fireEvent.press(nextButton);
    });

    expect(mockAlert).toHaveBeenCalledWith(
      'Brak zasięgu GPS',
      'Nie udało się pobrać lokalizacji. Przechodzisz dalej bez lokalizacji.',
    );
    expect(mockPush).toHaveBeenCalled();
  });

  it('powinien_przerwać_utworzenie_i_pokazać_alert_przy_braku_wymaganych_pol', async () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({});
    (require('../src/context/AppContext').useAppContext as jest.Mock).mockReturnValue({
      state: { checklists: [] },
    });

    const { getByText } = render(<ChecklistaFormScreen />);
    await waitFor(() => getByText('KARTA WIZYTY'));

    const nextButton = getByText('Dalej →');
    await act(async () => {
      fireEvent.press(nextButton);
    });

    expect(mockAlert).toHaveBeenCalledWith('Podaj numer sklepu');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
