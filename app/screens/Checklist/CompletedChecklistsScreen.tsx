import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Realm from 'realm';
import { ChecklistSchema, Checklist } from '../../../src/realm/Checklist';
import { TaskSchema } from '../../../src/realm/Task';
import { useRouter } from 'expo-router';

export default function CompletedChecklistsScreen() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const router = useRouter();

  useEffect(() => {
    let realmInstance: Realm | null = null;
    Realm.open({ 
      schema: [ChecklistSchema, TaskSchema],
      schemaVersion: 4,
      deleteRealmIfMigrationNeeded: true,
    }).then(instance => {
      realmInstance = instance;
      const all = instance.objects<Checklist>('Checklist').sorted('createdAt', true);
      setChecklists([...JSON.parse(JSON.stringify(all))]);
    });
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
      realmInstance.close();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wykonane checklisty</Text>
      <FlatList
        data={checklists}
        key={checklists.length}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/screens/Checklist/ChecklistDetailsScreen', params: { id: item.id } })}
            >
              <Text style={styles.itemText}>{item.sklep || 'Brak nazwy sklepu'}</Text>
                  <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</Text>
            </Pressable>
            <Pressable
              style={{ padding: 4, backgroundColor: 'transparent', borderRadius: 6, marginLeft: 8, alignSelf: 'center' }}
              onPress={async () => {
                // Usuwanie checklisty i powiązanych zadań
                let realmInstance: Realm | undefined;
                try {
                realmInstance = await Realm.open({
                schema: [ChecklistSchema, TaskSchema],
                schemaVersion: 4,
                deleteRealmIfMigrationNeeded: true,
                });
                realmInstance.write(() => {
                // Usuń powiązane zadania
                const tasksToDelete = realmInstance.objects('Task').filtered('checklistId == $0', item.id);
                realmInstance.delete(tasksToDelete);
                // Usuń checklistę
                const checklistToDelete = realmInstance.objectForPrimaryKey('Checklist', item.id);
                if (checklistToDelete) realmInstance.delete(checklistToDelete);
                });
                // Odśwież listę
                const all = realmInstance.objects<Checklist>('Checklist').sorted('createdAt', true);
                setChecklists([...JSON.parse(JSON.stringify(all))]);
                } catch (error) {
                console.error('Błąd przy usuwaniu checklisty:', error);
                } finally {
                if (realmInstance && !realmInstance.isClosed) {
                realmInstance.close();
                }
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