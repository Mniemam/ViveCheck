import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRealm } from '../../../src/data/realm';
import { Checklist } from '../../../src/context/types';
import { useRouter } from 'expo-router';
import { useCurrentLocation } from '../../../src/hooks/useLocation';
import { useFocusEffect } from '@react-navigation/native';

// Prosta funkcja sprawdzająca połączenie z internetem z timeoutem
async function isOnline() {
  const timeout = 3000;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch('https://www.google.com', { method: 'HEAD', signal: controller.signal });
    clearTimeout(id);
    return response.ok;
  } catch {
    return false;
  }
}

// Placeholder synchronizacji checklist
async function syncChecklistsIfNeeded() {
  // Tu można dodać logikę synchronizacji z backendem
  // Np. wysyłanie lokalnych checklist na serwer
  // Na razie tylko symulacja
  return true;
}

export default function CompletedChecklistsScreen() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const router = useRouter();
  const { getLocation } = useCurrentLocation();

  // Flaga, by uzupełnianie city wykonało się tylko raz po wejściu na ekran
  const cityUpdateDone = useRef(false);

  useFocusEffect(() => {
    let realmInstance: Realm | null = null;
    // Pobierz checklisty natychmiast
    getRealm().then(async (instance) => {
      realmInstance = instance;
      const all = instance.objects<Checklist>('Checklist').sorted('createdAt', true);
      setChecklists([...JSON.parse(JSON.stringify(all))]);

      // Uzupełnienie city tylko raz po wejściu na ekran
      if (!cityUpdateDone.current) {
        cityUpdateDone.current = true;
        (async () => {
          const missing = realmInstance!
            .objects<Checklist>('Checklist')
            .filtered('location != null AND (city == "" OR city == null)');
          for (const cl of missing) {
            try {
              const fresh = await getLocation();
              if (fresh?.city) {
                realmInstance!.write(() => {
                  cl.city = fresh.city;
                });
              }
            } catch {
              // silently ignore
            }
          }
        })();
      }
    });
    // Sprawdź internet i synchronizuj w tle
    (async () => {
      const online = await isOnline();
      if (online) {
        await syncChecklistsIfNeeded();
      }
    })();
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wykonane checklisty</Text>
      <FlatList
        data={checklists}
        key={checklists.length}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() =>
                router.push({
                  pathname: '/screens/Checklist/ChecklistDetailsScreen',
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.itemText}>{item.sklep || 'Brak nazwy sklepu'}</Text>
              <Text style={styles.date}>
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
              </Text>
            </Pressable>
            <Pressable
              style={{
                padding: 4,
                backgroundColor: 'transparent',
                borderRadius: 6,
                marginLeft: 8,
                alignSelf: 'center',
              }}
              onPress={async () => {
                try {
                  const realm = await getRealm();
                  realm.write(() => {
                    const tasksToDelete = realm
                      .objects('Task')
                      .filtered('checklistId == $0', item.id);
                    realm.delete(tasksToDelete);
                    const checklistToDelete = realm.objectForPrimaryKey('Checklist', item.id);
                    if (checklistToDelete) realm.delete(checklistToDelete);
                  });
                  const all = realm
                    .objects<Checklist>('Checklist')
                    .sorted('createdAt', true);
                  setChecklists([...JSON.parse(JSON.stringify(all))]);
                  realm.close();
                } catch (error) {
                  console.error('Błąd przy usuwaniu checklisty:', error);
                }
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Brak wykonanych checklist.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
});
