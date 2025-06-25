import * as FileSystem from 'expo-file-system';
import { prepareTasksWithBase64, generateChecklistHTML } from '../src/utils/pdfTemplate';

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

describe('prepareTasksWithBase64', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('testPrepareTasksWithBase64ConvertsValidUris', async () => {
    // Arrange
    const mockTasks = [
      { id: 1, title: 'Task with photos', photoUris: ['file://image1.jpg', 'file://image2.jpg'] },
      { id: 2, title: 'Task without photos', photoUris: [] },
      { id: 3, title: 'Task with undefined photos' },
    ];

    const mockedReadAsync = FileSystem.readAsStringAsync as jest.Mock;
    mockedReadAsync
      .mockResolvedValueOnce('base64string1')
      .mockResolvedValueOnce('base64string2');

    const expectedResult = [
      {
        id: 1,
        title: 'Task with photos',
        photoUris: ['file://image1.jpg', 'file://image2.jpg'],
        photoBase64Arr: ['data:image/jpeg;base64,base64string1', 'data:image/jpeg;base64,base64string2'],
      },
      {
        id: 2,
        title: 'Task without photos',
        photoUris: [],
        photoBase64Arr: [],
      },
      {
        id: 3,
        title: 'Task with undefined photos',
        photoBase64Arr: [],
      },
    ];

    // Act
    const result = await prepareTasksWithBase64(mockTasks);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledTimes(2);
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file://image1.jpg', {
      encoding: FileSystem.EncodingType.Base64,
    });
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file://image2.jpg', {
      encoding: FileSystem.EncodingType.Base64,
    });
  });
});

describe('generateChecklistHTML', () => {
  test('testGenerateChecklistHTMLWithFullData', () => {
    // Arrange
    const mockChecklistInfo = {
      title: 'Monthly Store Inspection',
      subtitle: 'Store #123',
      date: '2024-01-15',
    };

    const mockGroupedTasks = {
      Exterior: [
        {
          title: 'Check parking lot',
          notes: 'Clean and tidy.',
          photoBase64Arr: ['data:image/jpeg;base64,exterior_image_1'],
        },
      ],
      Interior: [
        {
          title: 'Aisles clear',
          notes: 'Aisle 3 has a small spill.',
          photoBase64Arr: [],
        },
        {
          title: 'Check shelving',
          notes: 'Fully stocked.',
          photoBase64Arr: ['data:image/jpeg;base64,interior_image_1', 'data:image/jpeg;base64,interior_image_2'],
        },
      ],
    };

    // Act
    const resultHtml = generateChecklistHTML(mockChecklistInfo, mockGroupedTasks);

    // Assert
    // Check for checklist details
    expect(resultHtml).toContain('Monthly Store Inspection');
    expect(resultHtml).toContain('<p><b>Podtytuł:</b> Store #123</p>');
    expect(resultHtml).toContain('2024-01-15');

    // Check for categories
    expect(resultHtml).toContain('Exterior');
    expect(resultHtml).toContain('Interior');

    // Check for tasks and their details
    expect(resultHtml).toContain('Check parking lot');
    expect(resultHtml).toContain('Clean and tidy.');
    expect(resultHtml).toContain('<img src="data:image/jpeg;base64,exterior_image_1"');

    expect(resultHtml).toContain('Aisles clear');
    expect(resultHtml).toContain('Aisle 3 has a small spill.');

    expect(resultHtml).toContain('Check shelving');
    expect(resultHtml).toContain('Fully stocked.');
    expect(resultHtml).toContain('<img src="data:image/jpeg;base64,interior_image_1"');
    expect(resultHtml).toContain('<img src="data:image/jpeg;base64,interior_image_2"');
  });
});