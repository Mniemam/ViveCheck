import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Checklist, ChecklistItem } from '../../../src/context/types';
import { useAppContext } from '../../../src/context/AppContext';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  image: { width: '100%', height: 200, marginTop: 16, borderRadius: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  marginTop16: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  itemCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemText: { fontSize: 16 },
  itemStatus: { fontSize: 14, color: '#2196F3', marginTop: 4 },
  itemPhoto: { width: '100%', height: 120, borderRadius: 6, marginTop: 8 },
});

const ChecklistDetails = () => {
  // Get only the checklist ID from params and fetch full object from context
  const { checklistId } = useLocalSearchParams<{ checklistId: string }>();
  const { state } = useAppContext();
  const parsed: Checklist | undefined = state.checklists.find((c: Checklist) => c.id === checklistId);

  if (!parsed) {
    return (
      <View style={styles.center}>
        <Text>Błąd: nie znaleziono danych.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{parsed.title || 'Brak tytułu'}</Text>
      {/* Usunięto wyświetlanie daty, bo nie ma pola createdAt */}
      <Text>
        Lokalizacja: {parsed.location ? `${parsed.location.latitude}, ${parsed.location.longitude}` : 'brak'}
      </Text>
      <Text>Liczba zadań: {Array.isArray(parsed.items) ? parsed.items.length : 0}</Text>

      <Text style={styles.sectionTitle}>Zadania:</Text>
      {parsed.items && parsed.items.length > 0 ? (
        parsed.items.map((item: ChecklistItem) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemText}>{item.text || 'Brak opisu zadania'}</Text>
            <Text style={styles.itemStatus}>
              Status: {item.completed ? 'Wykonano' : 'Niewykonane'}
            </Text>
            {/* Jeśli w przyszłości ChecklistItem będzie mieć photoUri, można dodać: */}
            {/* {item.photoUri && <Image source={{ uri: item.photoUri }} style={styles.itemPhoto} />} */}
          </View>
        ))
      ) : (
        <Text style={styles.marginTop16}>Brak zadań w tej checkliście.</Text>
      )}
    </ScrollView>
  );
};

export default ChecklistDetails;