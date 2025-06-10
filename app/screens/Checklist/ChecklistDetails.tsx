

import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Checklist } from '../../../src/context/types';

const ChecklistDetails = () => {
  const { checklist } = useLocalSearchParams();
  const parsed: Checklist = checklist ? JSON.parse(String(checklist)) : undefined;

  if (!parsed) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Błąd: nie znaleziono danych.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{parsed.title}</Text>
      <Text>Data: {new Date(parsed.createdAt).toLocaleString()}</Text>
      <Text>Lokalizacja: {parsed.location ? `${parsed.location.latitude}, ${parsed.location.longitude}` : 'brak'}</Text>
      <Text>Liczba zadań: {parsed.items.length}</Text>
      {parsed.photoUri ? (
        <Image source={{ uri: parsed.photoUri }} style={{ width: '100%', height: 200, marginTop: 16 }} />
      ) : (
        <Text style={{ marginTop: 16 }}>Brak zdjęcia głównego</Text>
      )}
    </ScrollView>
  );
};

export default ChecklistDetails;