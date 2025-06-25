
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ChecklistDetailsScreen from '../app/screens/Checklist/ChecklistDetailsScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRealm } from '../src/data/realm';
import * as FileSystem from 'expo-file-system';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('../src/data/realm', () => ({
  getRealm: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

jest.mock('react-native-html-to-pdf', () => ({
  convert: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

const mockUseRouter = useRouter as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockGetRealm = getRealm as jest.Mock;
const mockGetInfoAsync = FileSystem.getInfoAsync as jest.Mock;
const mockReadAsStringAsync = FileSystem.readAsStringAsync as jest.Mock;
const mockConvert = RNHTMLtoPDF.convert as jest.Mock;
const mockIsAvailableAsync = Sharing.isAvailableAsync as jest.Mock;
const mockShareAsync = Sharing.shareAsync as jest.Mock;

describe('ChecklistDetailsScreen', () => {
  let mockChecklistFiltered: jest.Mock;
  let mockTaskFiltered: jest.Mock;

  const mockRouter = {
    push: jest.fn(),
  };

  const mockChecklist = {
    id: 'checklist-1',
    sklep: 'Test Store',
    city: 'Test City',
    mr: 'Test MR',
    prowadzacaZmiane: 'Test Leader',
    prognozaPodstawowy: '90%',
    prognozaKomplementarny: '80%',
    skutecznoscChemii: '70%',
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseLocalSearchParams.mockReturnValue({ id: 'checklist-1' });

    mockChecklistFiltered = jest.fn().mockReturnValue([mockChecklist]);
    mockTaskFiltered = jest.fn().mockReturnValue([]);

    const mockObjects = jest.fn().mockImplementation((model: string | any) => {
      const modelName = typeof model === 'string' ? model : model.schema.name;
      if (modelName === 'Checklist') {
        return { filtered: mockChecklistFiltered };
      }
      if (modelName === 'Task') {
        return { filtered: mockTaskFiltered };
      }
      return { filtered: jest.fn().mockReturnValue([]) };
    });

    mockGetRealm.mockResolvedValue({
      objectForPrimaryKey: jest.fn().mockReturnValue(mockChecklist),
      objects: mockObjects,
      close: jest.fn(),
    });
  });

  it('powinien nawigować do edycji checklisty po naciśnięciu przycisku "Otwórz checklistę"', async () => {
    const { findByText } = render(<ChecklistDetailsScreen />);

    const openButton = await findByText('Otwórz checklistę');
    fireEvent.press(openButton);

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/screens/Checklist/CategoryCheckScreen',
      params: { checklistId: 'checklist-1', editMode: 'true' },
    });
  });

  it('powinien wygenerować i udostępnić PDF po naciśnięciu przycisku "Generuj raport PDF"', async () => {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Task 1',
        category: 'Category 1',
        photoUris: ['file:///image1.jpg'],
      },
    ];

    mockTaskFiltered.mockReturnValue(mockTasks);

    mockGetInfoAsync.mockResolvedValue({ exists: true });
    mockReadAsStringAsync.mockResolvedValue('base64-encoded-image');
    mockConvert.mockResolvedValue({ filePath: '/path/to/pdf' });
    mockIsAvailableAsync.mockResolvedValue(true);

    const { findByText } = render(<ChecklistDetailsScreen />);

    const generatePdfButton = await findByText('Generuj raport PDF');
    await act(async () => {
      fireEvent.press(generatePdfButton);
    });

    await waitFor(() => {
      expect(mockGetInfoAsync).toHaveBeenCalledWith('file:///image1.jpg');
    });

    await waitFor(() => {
      expect(mockReadAsStringAsync).toHaveBeenCalledWith('file:///image1.jpg', {
        encoding: 'base64',
      });
    });

    await waitFor(() => {
      expect(mockConvert).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockShareAsync).toHaveBeenCalledWith('file:///path/to/pdf');
    });
  });
});
