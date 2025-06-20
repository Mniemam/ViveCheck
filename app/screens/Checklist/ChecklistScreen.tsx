import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../../src/context/AppContext';
import Realm from 'realm';
import { ChecklistSchema } from '../../../src/realm/Checklist';
import { TaskSchema } from '../../../src/realm/Task';
import { initialCategories } from '../../../src/data/categories';


export default function ChecklistaFormScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  const [sklep, setSklep] = useState('');
  const [data, setData] = useState('');
  const [mr, setMR] = useState('');
  const [prowadzacaZmiane, setProwadzacaZmiane] = useState('');
  const [prognozaPodstawowy, setPrognozaPodstawowy] = useState('');
  const [prognozaKomplementarny, setPrognozaKomplementarny] = useState('');
  const [skutecznoscChemii, setSkutecznoscChemii] = useState('');
  // Przykładowa kategoria (możesz podmienić na dynamicznie wybieraną)
  // Przygotuj WSZYSTKIE zadania ze wszystkich kategorii
  const allCategoryTasks = initialCategories.flatMap(cat =>
  (cat.tasks || []).map(task => ({
  ...task,
  komentarz: '',
  photoUri: null,
  category: cat.title,
  }))
  );
  const [tasks, setTasks] = useState<any[]>(allCategoryTasks);

  // Realm instance
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    let realmInstance: Realm;
    console.log('Inicjalizacja Realm...');
    Realm.open({ 
      schema: [ChecklistSchema, TaskSchema], 
      schemaVersion: 4,
      deleteRealmIfMigrationNeeded: true,
    })
      .then(instance => {
        console.log('Realm otwarty!');
        setRealm(instance);
        realmInstance = instance;
      })
      .catch(error => {
        console.error('Błąd otwierania Realm:', error);
      });
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>KARTA WIZYTY</Text>

      <Text style={styles.label}>SKLEP VP:</Text>
      <TextInput style={styles.input} value={sklep} onChangeText={setSklep} placeholder="np. VP123" />

      
      <Text style={styles.label}>MR:</Text>
      <TextInput style={styles.input} value={mr} onChangeText={setMR} placeholder="np. Jan Kowalski" />

      <Text style={styles.label}>Prowadząca zmianę:</Text>
      <TextInput style={styles.input} value={prowadzacaZmiane} onChangeText={setProwadzacaZmiane} placeholder="Imię i nazwisko" />

      <Text style={styles.label}>% prognoza (asort. podstawowy):</Text>
      <TextInput style={styles.input} value={prognozaPodstawowy} onChangeText={setPrognozaPodstawowy} keyboardType="numeric" />

      <Text style={styles.label}>% prognoza (asort. komplementarny):</Text>
      <TextInput style={styles.input} value={prognozaKomplementarny} onChangeText={setPrognozaKomplementarny} keyboardType="numeric" />

      <Text style={styles.label}>% skuteczność sprzedaży chemii:</Text>
      <TextInput style={styles.input} value={skutecznoscChemii} onChangeText={setSkutecznoscChemii} keyboardType="numeric" />

      <View style={{ marginTop: 24 }}>
        {realm ? (
          <Button
            title="Dalej →"
            onPress={() => {
              if (!sklep.trim()) {
                alert('Podaj numer sklepu');
                return;
              }
              // Realm jest gotowy
              // Zapisz checklistę i zadania do bazy
              const id = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
              try {
              // Nadaj id każdemu zadaniu tylko raz
              const tasksWithIds = tasks.map(task => ({
              ...task,
              id: `${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
              checklistId: id,
              category: task.category,
              photoUri: null,
              komentarz: null,
              osobaOdpowiedzialna: null,
              completed: false,
              }));
              realm.write(() => {
              // Zapisz checklistę
              realm.create('Checklist', {
              id,
              sklep,
              data,
              mr,
              prowadzacaZmiane,
              prognozaPodstawowy,
              prognozaKomplementarny,
              skutecznoscChemii,
              createdAt: new Date(),
              });
              // Zapisz zadania powiązane z checklistą
              tasksWithIds.forEach(task => {
              realm.create('Task', task);
              });
              });
              setTasks(tasksWithIds);
              } catch (error) {
              console.error('Błąd zapisu checklisty:', error);
              Alert.alert('Błąd', 'Nie udało się zapisać checklisty.');
              return;
              }
              router.push({
              pathname: '../Checklist/CategoryCheckScreen',
              params: {
              checklistId: id,
              editMode: 'true',
              sklep,
              data,
              mr,
              prowadzacaZmiane,
              prognozaPodstawowy,
              prognozaKomplementarny,
              skutecznoscChemii,
              },
              });
              }}
          />
        ) : (
          <Text style={{textAlign: 'center', color: '#888'}}>Ładowanie bazy...</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
});
