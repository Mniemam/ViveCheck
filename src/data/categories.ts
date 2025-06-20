import { Task } from '../context/types';

export type Category = {
  title: string;
  tasks: Task[];
};

export const initialCategories: Category[] = [
  {
    title: 'STREFA WEJŚCIA',
    tasks: [
      { id: '1', title: 'Czystość i porządek przed sklepem', obszar: 'Czystość i porządek przed sklepem', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '2', title: 'Witryny - czystość, oznaczenie plakatowe', obszar: 'Witryny - czystość, oznaczenie plakatowe', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '3', title: 'Manekiny, podesty - estetyka, stylistyka', obszar: 'Manekiny, podesty - estetyka, stylistyka', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '4', title: 'TV- aktualność wyświetlanych materiałów', obszar: 'TV- aktualność wyświetlanych materiałów', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '5', title: 'Potykacz - zgodność plakatów', obszar: 'Potykacz - zgodność plakatów', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '6', title: 'Czystość w strefie wejścia i pod wózkami', obszar: 'Czystość w strefie wejścia i pod wózkami', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'KASY',
    tasks: [
      { id: '7', title: 'Porządek na ladzie kasowej', obszar: 'Porządek na ladzie kasowej', termin: 'każdego dnia', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '8', title: 'Porządek w strefie przy ladzie kasowej', obszar: 'Porządek w strefie przy ladzie kasowej', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '9', title: 'Porządek w szufladach i szafkach kasowych i przykasowych', obszar: 'Porządek w szufladach i szafkach kasowych i przykasowych', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '10', title: 'Dostępność reklamówek, toreb na odpsrzedaż', obszar: 'Dostępność reklamówek, toreb na odpsrzedaż', termin: 'każdego dnia', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '11', title: 'Ilość zalogowanych kas', obszar: 'Ilość zalogowanych kas', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '12', title: 'Ocena reakcji na kolejkę', obszar: 'Ocena reakcji na kolejkę', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'PRZYMIERZALNIE',
    tasks: [
      { id: '13', title: 'Czystość w przymierzalniach', obszar: 'Czystość w przymierzalniach', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '14', title: 'Weryfikacja poprawności komunikatów w przymierzalniach', obszar: 'Weryfikacja poprawności komunikatów w przymierzalniach', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '15', title: 'Dostępność wieszaków dla klientów', obszar: 'Dostępność wieszaków dla klientów', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'ASORTYMENT KOMPLEMENTARNY',
    tasks: [
      { id: '16', title: 'Dotowarowanie i estetyka ekspozycji', obszar: 'Dotowarowanie i estetyka ekspozycji', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '17', title: 'Sposób ekspozycji towaru na kasie', obszar: 'Sposób ekspozycji towaru na kasie', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '18', title: 'Ekspozycja książek', obszar: 'Ekspozycja książek', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '19', title: 'Ekspozycja VIVE BOX', obszar: 'Ekspozycja VIVE BOX', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '20', title: 'Ekspozycje pozostałych asortymentów komplementarnych', obszar: 'Ekspozycje pozostałych asortymentów komplementarnych', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'SALA SPRZEDAŻY',
    tasks: [
      { id: '21', title: 'Czystość podłogi', obszar: 'Czystość podłogi', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '22', title: 'Czystość luster', obszar: 'Czystość luster', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '23', title: 'Brak towaru wieszakowego na podłodze', obszar: 'Brak towaru wieszakowego na podłodze', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '24', title: 'Estetyka ułożenia butów', obszar: 'Estetyka ułożenia butów', termin: 'w ciągu cyklu', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '25', title: 'Zgodność plakatów z wytycznymi z Centrali', obszar: 'Zgodność plakatów z wytycznymi z Centrali', termin: 'każdego dnia', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '26', title: 'Ekspozycja towaru na kracie', obszar: 'Ekspozycja towaru na kracie', termin: 'każdego dnia', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '27', title: 'Standard ekspozycji strefa TOP', obszar: 'Standard ekspozycji strefa TOP', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '28', title: 'Towar stołowy: podział zgodnie z wytycznymi, oznaczenie plakatami', obszar: 'Towar stołowy: podział zgodnie z wytycznymi, oznaczenie plakatami', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'BIURO, ZAPLECZE, MAGAZYN',
    tasks: [
      { id: '29', title: 'Czystość w pomieszczeniu biurowym (dot. dokumentacji)', obszar: 'Czystość w pomieszczeniu biurowym (dot. dokumentacji)', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '30', title: 'Czystość w pomieszczeniu biurowym (dot. pozostawionej odzieży i towaru na sprzedaż)', obszar: 'Czystość w pomieszczeniu biurowym (dot. pozostawionej odzieży i towaru na sprzedaż)', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '31', title: 'Magazyn - weryfikacja ułożenia as. komplementarnych na zapleczu', obszar: 'Magazyn - weryfikacja ułożenia as. komplementarnych na zapleczu', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '32', title: 'Magazyn - weryfikacja odzieży G4P (worki zamknięte trytytką)', obszar: 'Magazyn - weryfikacja odzieży G4P (worki zamknięte trytytką)', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '33', title: 'Magazyn - weryfikacja całości wyłożonego towaru podstawowego', obszar: 'Magazyn - weryfikacja całości wyłożonego towaru podstawowego', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '34', title: 'Szatnia - weryfikacja czystości', obszar: 'Szatnia - weryfikacja czystości', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '35', title: 'Szatnia - weryfikacja szafek pracowniczych', obszar: 'Szatnia - weryfikacja szafek pracowniczych', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '36', title: 'Weryfikacja 5 wybranych asortymentów - zgodność ze stanem magazynowym', obszar: 'Weryfikacja 5 wybranych asortymentów - zgodność ze stanem magazynowym', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '37', title: 'Weryfikacja zadań przekazanych do realizacji po ostatniej wizycie', obszar: 'Weryfikacja zadań przekazanych do realizacji po ostatniej wizycie', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'ZADANIA DODATKOWE',
    tasks: [
      { id: '38', title: '', obszar: '', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '39', title: '', obszar: '', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '40', title: '', obszar: '', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
      { id: '41', title: '', obszar: '', completed: false, komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
];

export const getCategoryByTitle = (title: string): Category | undefined =>
  initialCategories.find(cat => cat.title === title);