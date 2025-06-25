import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../../src/context/AppContext';
import { getRealm } from '../../../src/data/realm';
import { initialCategories } from '../../../src/data/categories';
import { useCurrentLocation } from '../../../src/hooks/useLocation';
import { Checklist } from '../../../src/context/types';

export default function ChecklistaFormScreen() {
  const router = useRouter();
  const { checklistId } = useLocalSearchParams<{ checklistId?: string }>();
  const { state } = useAppContext();

  // Tryb podglądu: jeśli jest checklistId, pobierz checklistę z kontekstu
  const checklist: Checklist | undefined = checklistId
    ? state.checklists.find((c: Checklist) => c.id === checklistId)
    : undefined;

  // Jeżeli jesteśmy w trybie podglądu, ustaw readonly
  const isPreview = !!checklistId && !!checklist;

  // Stan pól formularza (tylko do edycji/nowej checklisty)
  const [sklep, setSklep] = useState(isPreview ? checklist?.sklep || '' : '');
  const [mr, setMR] = useState(isPreview ? checklist?.mr || '' : '');
  const [prowadzacaZmiane, setProwadzacaZmiane] = useState(
    isPreview ? checklist?.prowadzacaZmiane || '' : '',
  );
  const [prognozaPodstawowy, setPrognozaPodstawowy] = useState(
    isPreview ? checklist?.prognozaPodstawowy || '' : '',
  );
  const [prognozaKomplementarny, setPrognozaKomplementarny] = useState(
    isPreview ? checklist?.prognozaKomplementarny || '' : '',
  );
  const [skutecznoscChemii, setSkutecznoscChemii] = useState(
    isPreview ? checklist?.skutecznoscChemii || '' : '',
  );

  // Przygotuj WSZYSTKIE zadania ze wszystkich kategorii (tylko do nowej)
  const allCategoryTasks = initialCategories.flatMap((cat) =>
    (cat.tasks || []).map((task) => ({
      ...task,
      id: `${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
      komentarz: '',
      photoUris: [],
      category: cat.title,
    })),
  );
  const [tasks, setTasks] = useState<any[]>(allCategoryTasks);

  // Realm instance
  const [realm, setRealm] = useState<Realm | null>(null);

  const { getLocation } = useCurrentLocation();
  const [cachedLoc, setCachedLoc] = useState<{
    latitude: number;
    longitude: number;
    city: string;
  } | null>(null);

  useEffect(() => {
    let realmInstance: Realm;
    getRealm()
      .then((instance) => {
        setRealm(instance);
        realmInstance = instance;
      })
      .catch(() => {
        // obsługa błędu
      });
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    getLocation().then((loc) => {
      if (mounted) setCachedLoc(loc);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Jeśli nie znaleziono checklisty w trybie podglądu
  if (!!checklistId && !checklist) {
    return (
      <View style={styles.center}>
        <Text>Błąd: nie znaleziono danych.</Text>
      </View>
    );
  }

  // Komentarz: Tryb podglądu checklisty (readonly) lub tryb tworzenia/edycji
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>KARTA WIZYTY</Text>

      <Text style={styles.label}>SKLEP VP:</Text>
      <TextInput
        style={styles.input}
        value={sklep}
        onChangeText={setSklep}
        placeholder="np. VP123"
        editable={!isPreview}
      />

      <Text style={styles.label}>MR:</Text>
      <TextInput
        style={styles.input}
        value={mr}
        onChangeText={setMR}
        placeholder="np. Jan Kowalski"
        editable={!isPreview}
      />

      <Text style={styles.label}>Prowadząca zmianę:</Text>
      <TextInput
        style={styles.input}
        value={prowadzacaZmiane}
        onChangeText={setProwadzacaZmiane}
        placeholder="Imię i nazwisko"
        editable={!isPreview}
      />

      <Text style={styles.label}>% prognoza (asort. podstawowy):</Text>
      <TextInput
        style={styles.input}
        value={prognozaPodstawowy}
        onChangeText={setPrognozaPodstawowy}
        keyboardType="numeric"
        editable={!isPreview}
      />

      <Text style={styles.label}>% prognoza (asort. komplementarny):</Text>
      <TextInput
        style={styles.input}
        value={prognozaKomplementarny}
        onChangeText={setPrognozaKomplementarny}
        keyboardType="numeric"
        editable={!isPreview}
      />

      <Text style={styles.label}>% skuteczność sprzedaży chemii:</Text>
      <TextInput
        style={styles.input}
        value={skutecznoscChemii}
        onChangeText={setSkutecznoscChemii}
        keyboardType="numeric"
        editable={!isPreview}
      />

      {/* Lokalizacja i miasto w trybie podglądu */}
      {isPreview && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Lokalizacja:</Text>
          <Text>
            {checklist?.location
              ? `${checklist.location.latitude}, ${checklist.location.longitude}`
              : 'brak'}
          </Text>
          <Text style={styles.label}>Miasto:</Text>
          <Text>{checklist?.city || 'brak'}</Text>
        </View>
      )}

      {/* Przycisk Dalej tylko w trybie tworzenia */}
      {!isPreview && (
        <View style={{ marginTop: 24 }}>
          {realm ? (
            <Pressable
              style={styles.nextButton}
              onPress={async () => {
                // weryfikacja GPS
                let latitude = 0;
                let longitude = 0;
                let cityName = '';
                if (!cachedLoc) {
                  Alert.alert(
                    'Brak zasięgu GPS',
                    'Nie udało się pobrać lokalizacji. Przechodzisz dalej bez lokalizacji.',
                  );
                } else {
                  latitude = cachedLoc.latitude;
                  longitude = cachedLoc.longitude;
                  cityName = cachedLoc.city;
                }
                try {
                  const realm = await getRealm();

                  if (!sklep.trim()) {
                    Alert.alert('Podaj numer sklepu');
                    return;
                  }
                  const id = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
                  const tasksWithIds = tasks.map((task, index) => ({
                    ...task,
                    id: task.id || `${id}_${index}`,
                    checklistId: id,
                    completed: false,
                  }));

                  realm.write(() => {
                    realm.create(
                      'Checklist',
                      {
                        id,
                        sklep,
                        mr,
                        prowadzacaZmiane,
                        prognozaPodstawowy,
                        prognozaKomplementarny,
                        skutecznoscChemii,
                        createdAt: new Date(),
                        location: { latitude, longitude },
                        city: cityName,
                        items: tasksWithIds.map((task) => ({
                          id: task.id,
                          title: task.title,
                          completed: false,
                          komentarz: task.komentarz || '',
                          osobaOdpowiedzialna: task.osobaOdpowiedzialna || '',
                        })),
                      },
                      true,
                    );

                    tasksWithIds.forEach((task) => {
                      const existing = realm.objectForPrimaryKey('Task', task.id);
                      if (!existing) {
                        realm.create(
                          'Task',
                          {
                            ...task,
                            completed: task.completed ?? false,
                          },
                          true,
                        );
                      }
                    });
                  });

                  setTasks(tasksWithIds);

                  router.push({
                    pathname: '../Checklist/CategoryCheckScreen',
                    params: {
                      id,
                      checklistId: id,
                      editMode: 'true',
                      sklep,
                      mr,
                      prowadzacaZmiane,
                      prognozaPodstawowy,
                      prognozaKomplementarny,
                      skutecznoscChemii,
                    },
                  });

                  // W tle - uzupełnianie miasta
                  if (cachedLoc && !cityName) {
                    (async () => {
                      try {
                        const fresh = await getLocation();
                        if (fresh?.city) {
                          const realmBg = await getRealm();
                          realmBg.write(() => {
                            const cl = realmBg.objectForPrimaryKey('Checklist', id);
                            if (cl) {
                              cl.city = fresh.city;
                              cl.location = {
                                latitude: fresh.latitude,
                                longitude: fresh.longitude,
                              };
                            }
                          });
                        }
                      } catch (bgErr) {
                        console.warn('Background city update failed:', bgErr);
                      }
                    })();
                  }
                } catch (e: any) {
                  console.error(e);
                  Alert.alert(
                    'Błąd',
                    'Nie udało się zapisać checklisty: ' +
                      (e instanceof Error ? e.message : String(e)),
                  );
                }
              }}
            >
              <Text style={styles.nextButtonText}>Dalej →</Text>
            </Pressable>
          ) : (
            <Text style={{ textAlign: 'center', color: '#888' }}>Ładowanie bazy...</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginTop: 4,
    marginBottom: 2,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4678c0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginHorizontal: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
