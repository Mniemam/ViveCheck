import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Task = {
  id: string;
  section: string;
  obszar: string;
  termin?: string;
  komentarz: string;
  osobaOdpowiedzialna: string;
  photoUri?: string;
};

type Category = {
    title: string;
    tasks: Task[];
  };
  
  type RootStackParamList = {
    CategoryCheckScreen: undefined;
    Form: { category: Category };
  };
  
  type NavigationProp = StackNavigationProp<RootStackParamList, 'CategoryCheckScreen'>;


const initialCategories = [
  {
    title: 'STREFA WEJŚCIA',
    tasks: [
      { id: '1', section: 'STREFA WEJŚCIA', obszar: 'Czystość i porządek przed sklepem', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '2', section: 'STREFA WEJŚCIA', obszar: 'Witryny - czystość, oznaczenie plakatowe', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '3', section: 'STREFA WEJŚCIA', obszar: 'Manekiny, podesty - estetyka, stylistyka', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '4', section: 'STREFA WEJŚCIA', obszar: 'TV- aktualność wyświetlanych materiałów', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '5', section: 'STREFA WEJŚCIA', obszar: 'Potykacz - zgodność plakatów', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '6', section: 'STREFA WEJŚCIA', obszar: 'Czystość w strefie wejścia i pod wózkami', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'KASY',
    tasks: [
      { id: '7', section: 'KASY', obszar: 'Porządek na ladzie kasowej', termin: 'każdego dnia', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '8', section: 'KASY', obszar: 'Porządek w strefie przy ladzie kasowej', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '9', section: 'KASY', obszar: 'Porządek w szufladach i szafkach kasowych i przykasowych', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '10', section: 'KASY', obszar: 'Dostępność reklamówek, toreb na odpsrzedaż', termin: 'każdego dnia', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '11', section: 'KASY', obszar: 'Ilość zalogowanych kas', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '12', section: 'KASY', obszar: 'Ocena reakcji na kolejkę', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'PRZYMIERZALNIE',
    tasks: [
      { id: '13', section: 'PRZYMIERZALNIE', obszar: 'Czystość w przymierzalniach', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '14', section: 'PRZYMIERZALNIE', obszar: 'Weryfikacja poprawności komunikatów w przymierzalniach', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '15', section: 'PRZYMIERZALNIE', obszar: 'Dostępność wieszaków dla klientów', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'ASORTYMENT KOMPLEMETARNY',
    tasks: [
      { id: '16', section: 'ASORTYMENT KOMPLEMETARNY', obszar: 'Dotowarowanie i estetyka ekspozycji', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '17', section: 'ASORTYMENT KOMPLEMETARNY', obszar: 'Sposób ekspozycji towaru na kasie', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '18', section: 'ASORTYMENT KOMPLEMETARNY', obszar: 'Ekspozycja książek', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '19', section: 'ASORTYMENT KOMPLEMETARNY', obszar: 'Ekspozycja VIVE BOX', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '20', section: 'ASORTYMENT KOMPLEMETARNY', obszar: 'Ekspozycje pozostałych asortymentów komplementarnych', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'SALA SPRZEDAŻY',
    tasks: [
      { id: '21', section: 'SALA SPRZEDAŻY', obszar: 'Czystość podłogi', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '22', section: 'SALA SPRZEDAŻY', obszar: 'Czystość luster', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '23', section: 'SALA SPRZEDAŻY', obszar: 'Brak towaru wieszakowego na podłodze', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '24', section: 'SALA SPRZEDAŻY', obszar: 'Estetyka ułożenia butów', termin: 'w ciągu cyklu', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '25', section: 'SALA SPRZEDAŻY', obszar: 'Zgodność plakatów z wytycznymi z Centrali', termin: 'każdego dnia', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '26', section: 'SALA SPRZEDAŻY', obszar: 'Ekspozycja towaru na kracie', termin: 'każdego dnia', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '27', section: 'SALA SPRZEDAŻY', obszar: 'Standard ekspozycji strefa TOP', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '28', section: 'SALA SPRZEDAŻY', obszar: 'Towar stołowy: podział zgodnie z wytycznymi, oznaczenie plakatami', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'BIURO, ZAPLECZE, MAGAZYN',
    tasks: [
      { id: '29', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Czystość w pomieszczeniu biurowym (dot. dokumentacji)', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '30', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Czystość w pomieszczeniu biurowym (dot. pozostawionej odzieży i towaru na sprzedaż)', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '31', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Magazyn - weryfikacja ułożenia as. komplementarnych na zapleczu', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '32', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Magazyn - weryfikacja odzieży G4P (worki zamknięte trytytką)', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '33', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Magazyn - weryfikacja całości wyłożonego towaru podstawowego', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '34', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Szatnia - weryfikacja czystości', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '35', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Szatnia - weryfikacja szafek pracowniczych', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '36', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Weryfikacja 5 wybranych asortymentów - zgodność ze stanem magazynowym', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '37', section: 'BIURO, ZAPLECZE, MAGAZYN', obszar: 'Weryfikacja zadań przekazanych do realizacji po ostatniej wizycie', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
  {
    title: 'ZADANIA DODATKOWE',
    tasks: [
      { id: '38', section: 'ZADANIA DODATKOWE', obszar: '', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '39', section: 'ZADANIA DODATKOWE', obszar: '', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '40', section: 'ZADANIA DODATKOWE', obszar: '', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
      { id: '41', section: 'ZADANIA DODATKOWE', obszar: '', termin: '', komentarz: '', osobaOdpowiedzialna: '' },
    ],
  },
];

export default function CategoryCheckScreen() {
    const navigation = useNavigation<NavigationProp>();
    const handleSelectCategory = (category: Category) => {
      navigation.navigate('Form', { category });
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Wybierz kategorię</Text>
        <FlatList
          data={initialCategories}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <Pressable style={styles.categoryButton} onPress={() => handleSelectCategory(item)}>
              <Text style={styles.categoryButtonText}>{item.title}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eef6ff',
      padding: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12,
    },
    categoryButton: {
      backgroundColor: '#73c0d7',
      padding: 14,
      marginVertical: 6,
      borderRadius: 6,
    },
    categoryButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
    },
  });