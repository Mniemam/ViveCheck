import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../../src/context/AppContext';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const { state } = useAppContext();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
        Historia checklist:
      </Text>
      <FlatList
        data={state.checklists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '../screens/Checklist/ChecklistDetails',
                params: { checklist: JSON.stringify(item) },
              })
            }
          >
            <View
              style={{
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text>Liczba zadań: {item.items.length}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, textAlign: 'center' }}>
            Brak zapisanych checklist.
          </Text>
        }
      />
    </View>
  );
}
