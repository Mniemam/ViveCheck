import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoryCheckScreen from '../app/screens/Checklist/CategoryCheckScreen';
import { initialCategories } from '../src/data/categories';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(),
}));

describe('CategoryCheckScreen', () => {
  beforeEach(() => {
    const mockParams = {
      checklistId: 'test-checklist-id',
      readonly: 'false',
      editMode: 'false',
    };
    require('expo-router').useLocalSearchParams.mockReturnValue(mockParams);
  });

  it('powinien_wyświetlać_wszystkie_przyciski_kategorii', () => {
    const { getByText } = render(<CategoryCheckScreen />);
    initialCategories.forEach((category) => {
      expect(getByText(category.title)).toBeTruthy();
    });
  });

  it('powinien_wyświetlać_tekst_nagłówka', () => {
    const { getByText } = render(<CategoryCheckScreen />);
    expect(getByText('Wybierz kategorię')).toBeTruthy();
  });

  it('powinien_przejść_do_szczegółów_kategorii_po_kliknięciu_przycisku', () => {
    const mockPush = jest.fn();
    (require('expo-router').useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'test-checklist-id',
      readonly: 'false',
      editMode: 'false',
    });

    const { getByText } = render(<CategoryCheckScreen />);
    const firstCategory = initialCategories[0];
    fireEvent.press(getByText(firstCategory.title));
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/screens/Checklist/TaskCarouselScreen',
        params: expect.objectContaining({
          checklistId: 'test-checklist-id',
          categoryTitle: initialCategories[0].title,
        }),
      }),
    );
  });

  it('powinien_wyświetlać_przyciski_przy_prawidłowych_parametrach_nawigacji', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'valid-checklist-id',
      readonly: 'false',
      editMode: 'false',
    });

    const { getByText } = render(<CategoryCheckScreen />);
    expect(getByText('Wybierz kategorię')).toBeTruthy();
    initialCategories.forEach((category) => {
      expect(getByText(category.title)).toBeTruthy();
    });
  });

  it('powinien_posiadać_dostępne_przyciski_kategorii', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'test-checklist-id',
      readonly: 'false',
      editMode: 'false',
    });

    const { getByText } = render(<CategoryCheckScreen />);
    initialCategories.forEach((category) => {
      // Sprawdź, że tekst kategorii jest widoczny
      expect(getByText(category.title)).toBeTruthy();
    });
  });

  it('powinien_obsłużyć_brakujące_parametry_nawigacji', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({});
    const { getByText } = render(<CategoryCheckScreen />);
    expect(getByText('Wybierz kategorię')).toBeTruthy();
    initialCategories.forEach((category) => {
      expect(getByText(category.title)).toBeTruthy();
    });
  });

  it('powinien_nie_wyświetlać_przycisków_kategorii_gdy_brak_kategorii', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'test-checklist-id',
      readonly: 'false',
      editMode: 'false',
    });
    jest.mock('../src/data/categories', () => ({
      initialCategories: [],
    }));
    // Ponownie zaimportuj komponent, aby użyć zmockowanych kategorii
    const CategoryCheckScreenWithNoCategories =
      require('../app/screens/Checklist/CategoryCheckScreen').default;
    const { queryAllByRole } = render(<CategoryCheckScreenWithNoCategories />);
    // Zakładamy, że przyciski kategorii mają role 'button'
    expect(queryAllByRole('button').length).toBe(0);
  });

  it('powinien_wyświetlić_interfejs_zapasowy_w_przypadku_błędu_w_renderowaniu', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      checklistId: 'test-checklist-id',
      readonly: 'false',
      editMode: 'false',
    });
    // Zamockuj initialCategories jako nieprawidłowe dane
    jest.mock('../src/data/categories', () => ({
      initialCategories: null,
    }));
    // Ponownie zaimportuj komponent, aby użyć zmockowanych kategorii
    const CategoryCheckScreenWithError =
      require('../app/screens/Checklist/CategoryCheckScreen').default;
    const { getByText } = render(<CategoryCheckScreenWithError />);
    // Interfejs zapasowy wyświetla domyślny nagłówek, gdy dane kategorii są nieprawidłowe
    expect(getByText('Wybierz kategorię')).toBeTruthy();
  });
});
