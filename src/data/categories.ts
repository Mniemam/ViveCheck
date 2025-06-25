import { Task } from '../context/types';

/**
 * Reprezentuje kategorię zadań.
 * @typedef {object} Category
 * @property {string} title - Tytuł kategorii.
 * @property {Task[]} tasks - Tablica zadań należących do kategorii.
 */
export type Category = {
  title: string;
  tasks: Task[];
};

/**
 * Tablica predefiniowanych kategorii z ich początkowymi zadaniami.
 * @type {Category[]}
 */
export const initialCategories: Category[] = [
  {
    title: 'STREFA WEJŚCIA',
    tasks: [
      {
        id: '1',
        title: 'Czystość i porządek przed sklepem',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '2',
        title: 'Witryny - czystość, oznaczenie plakatowe',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '3',
        title: 'Manekiny, podesty - estetyka, stylistyka',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '4',
        title: 'TV- aktualność wyświetlanych materiałów',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '5',
        title: 'Potykacz - zgodność plakatów',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '6',
        title: 'Czystość w strefie wejścia i pod wózkami',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
    ],
  },
  {
    title: 'KASY',
    tasks: [
      {
        id: '7',
        title: 'Porządek na ladzie kasowej',
        termin: 'każdego dnia',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '8',
        title: 'Porządek w strefie przy ladzie kasowej',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '9',
        title: 'Porządek w szufladach i szafkach kasowych i przykasowych',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '10',
        title: 'Dostępność reklamówek, toreb na odpsrzedaż',
        termin: 'każdego dnia',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '11',
        title: 'Ilość zalogowanych kas',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '12',
        title: 'Ocena reakcji na kolejkę',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
    ],
  },
  {
    title: 'PRZYMIERZALNIE',
    tasks: [
      {
        id: '13',
        title: 'Czystość w przymierzalniach',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '14',
        title: 'Weryfikacja poprawności komunikatów w przymierzalniach',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '15',
        title: 'Dostępność wieszaków dla klientów',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
    ],
  },
  {
    title: 'ASORTYMENT KOMPLEMENTARNY',
    tasks: [
      {
        id: '16',
        title: 'Dotowarowanie i estetyka ekspozycji',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '17',
        title: 'Sposób ekspozycji towaru na kasie',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '18',
        title: 'Ekspozycja książek',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '19',
        title: 'Ekspozycja VIVE BOX',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '20',
        title: 'Ekspozycje pozostałych asortymentów komplementarnych',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
    ],
  },
  {
    title: 'SALA SPRZEDAŻY',
    tasks: [
      {
        id: '21',
        title: 'Czystość podłogi',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '22',
        title: 'Czystość luster',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '23',
        title: 'Brak towaru wieszakowego na podłodze',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '24',
        title: 'Estetyka ułożenia butów',
        termin: 'w ciągu cyklu',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '25',
        title: 'Zgodność plakatów z wytycznymi z Centrali',
        termin: 'każdego dnia',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '26',
        title: 'Ekspozycja towaru na kracie',
        termin: 'każdego dnia',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '27',
        title: 'Standard ekspozycji strefa TOP',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '28',
        title: 'Towar stołowy: podział zgodnie z wytycznymi, oznaczenie plakatami',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
    ],
  },
  {
    title: 'BIURO, ZAPLECZE, MAGAZYN',
    tasks: [
      {
        id: '29',
        title: 'Czystość w pomieszczeniu biurowym (dot. dokumentacji)',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '30',
        title:
          'Czystość w pomieszczeniu biurowym (dot. pozostawionej odzieży i towaru na sprzedaż)',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '31',
        title: 'Magazyn - weryfikacja ułożenia as. komplementarnych na zapleczu',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '32',
        title: 'Magazyn - weryfikacja odzieży G4P (worki zamknięte trytytką)',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '33',
        title: 'Magazyn - weryfikacja całości wyłożonego towaru podstawowego',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '34',
        title: 'Szatnia - weryfikacja czystości',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '35',
        title: 'Szatnia - weryfikacja szafek pracowniczych',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '36',
        title: 'Weryfikacja 5 wybranych asortymentów - zgodność ze stanem magazynowym',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
      {
        id: '37',
        title: 'Weryfikacja zadań przekazanych do realizacji po ostatniej wizycie',
        komentarz: '',
        osobaOdpowiedzialna: '',
      },
    ],
  },
  {
    title: 'ZADANIA DODATKOWE',
    tasks: [
      { id: '38', title: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '39', title: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '40', title: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '41', title: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
];

/**
 * Znajduje kategorię po jej tytule.
 * @param {string} title - Tytuł kategorii do znalezienia.
 * @returns {Category | undefined} Obiekt kategorii, jeśli zostanie znaleziony, w przeciwnym razie undefined.
 */
export const getCategoryByTitle = (title: string): Category | undefined =>
  initialCategories.find((cat) => cat.title === title);
