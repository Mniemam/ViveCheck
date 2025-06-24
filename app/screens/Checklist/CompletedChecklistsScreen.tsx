import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRealm } from '../../../src/data/realm';
import { Checklist } from '../../../src/context/types';
import { useRouter } from 'expo-router';
import { useCurrentLocation } from '../../../src/hooks/useLocation';
import { useFocusEffect } from '@react-navigation/native';

export default function CompletedChecklistsScreen() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const router = useRouter();
  const { getLocation } = useCurrentLocation();

  useFocusEffect(() => {
    let realmInstance: Realm | null = null;
    getRealm().then(async (instance) => {
      realmInstance = instance;
      const all = instance.objects<Checklist>('Checklist').sorted('createdAt', true);
      setChecklists([...JSON.parse(JSON.stringify(all))]);

      // Uzupełnienie city w tle
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
    });
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
