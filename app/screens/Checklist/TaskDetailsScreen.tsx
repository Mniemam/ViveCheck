import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Realm from 'realm';
import { ChecklistSchema, Checklist } from '../../../src/realm/Checklist';
import { useLocalSearchParams } from 'expo-router';
import { initialCategories } from '../../../src/data/categories';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    let realmInstance: Realm;
    Realm.open({ schema: [ChecklistSchema] }).then(instance => {
      realmInstance = instance;
      const found = instance.objectForPrimaryKey<Checklist>('Checklist', id as string);
      setChecklist(found ? { ...found } : null);
      // Pobierz zadania z initialCategories na podstawie sklepu (jeśli istnieje)
      if (found && found.sklep) {
        // Szukaj kategorii po tytule sklepu (jeśli takie mapowanie istnieje)
        const category = initialCategories.find(cat => cat.title === found.sklep);
        if (category) {
          setTasks(category.tasks);
        } else {
          // Jeśli nie ma kategorii, wyświetl placeholdery
          setTasks([{ title: 'Brak zadań dla tego sklepu', description: '' }]);
        }
      }
    });
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Szczegóły zadań</Text>
      {tasks.length === 0 && <Text style={styles.empty}>Brak zadań do wyświetlenia.</Text>}
      {tasks.map((task, idx) => (
        <View key={idx} style={styles.taskBox}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskField}>Opis: {task.description || '-'}</Text>
          {/* Możesz dodać więcej pól jeśli są w strukturze zadania */}
        </View>
      ))}
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
  taskBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  taskField: {
    fontSize: 14,
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
});
