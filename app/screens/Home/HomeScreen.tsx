import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViveCheck</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.push('/screens/Checklist/ChecklistScreen')}
        >
          <Text style={styles.homeButtonText}>➕ Nowa checklista</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.push('/screens/Checklist/CompletedChecklistsScreen')}
        >
          <Text style={styles.homeButtonText}>📄 Wykonane checklisty</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 12,
  },
  homeButton: {
    backgroundColor: '#4678c0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
