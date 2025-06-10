import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViveCheck</Text>

      <View style={styles.buttonContainer}>
        <Button title="➕ Nowa checklista" onPress={() => router.push('/checklista')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="📄 Wykonane checklisty" onPress={() => router.push('/history')} />
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
});