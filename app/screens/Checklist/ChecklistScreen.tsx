import { useAppContext } from '../../../src/context/AppContext';
import { Checklist } from '../../../src/context/types';
import { v4 as uuidv4 } from 'uuid';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';


export default function ChecklistaFormScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  const [sklep, setSklep] = useState('');
  const [data, setData] = useState('');
  const [mr, setMR] = useState('');
  const [prowadzacaZmiane, setProwadzacaZmiane] = useState('');
  const [prognozaPodstawowy, setPrognozaPodstawowy] = useState('');
  const [prognozaKomplementarny, setPrognozaKomplementarny] = useState('');
  const [skutecznoscChemii, setSkutecznoscChemii] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>KARTA WIZYTY</Text>

      <Text style={styles.label}>SKLEP VP:</Text>
      <TextInput style={styles.input} value={sklep} onChangeText={setSklep} placeholder="np. VP123" />

      <Text style={styles.label}>DATA:</Text>
      <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="rrrr-mm-dd" />

      <Text style={styles.label}>MR:</Text>
      <TextInput style={styles.input} value={mr} onChangeText={setMR} placeholder="np. Jan Kowalski" />

      <Text style={styles.label}>Prowadząca zmianę:</Text>
      <TextInput style={styles.input} value={prowadzacaZmiane} onChangeText={setProwadzacaZmiane} placeholder="Imię i nazwisko" />

      <Text style={styles.label}>% prognoza (asort. podstawowy):</Text>
      <TextInput style={styles.input} value={prognozaPodstawowy} onChangeText={setPrognozaPodstawowy} keyboardType="numeric" />

      <Text style={styles.label}>% prognoza (asort. komplementarny):</Text>
      <TextInput style={styles.input} value={prognozaKomplementarny} onChangeText={setPrognozaKomplementarny} keyboardType="numeric" />

      <Text style={styles.label}>% skuteczność sprzedaży chemii:</Text>
      <TextInput style={styles.input} value={skutecznoscChemii} onChangeText={setSkutecznoscChemii} keyboardType="numeric" />

      <View style={{ marginTop: 24 }}>
        <Button
          title="Dalej →"
          onPress={() =>
            router.push({
              pathname: '../checklist/Form',
              params: {
                sklep,
                data,
                mr,
                prowadzacaZmiane,
                prognozaPodstawowy,
                prognozaKomplementarny,
                skutecznoscChemii,
              },
            })
          }
        />
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
});
