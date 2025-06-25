import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getRealm } from '../../../src/data/realm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Checklist, Task } from '../../../src/context/types';
import { generateChecklistHTML } from '../../../src/utils/pdfTemplate';

export default function ChecklistDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [checklist, setChecklist] = useState<Checklist | null>(null);

  useEffect(() => {
    let realmInstance: any;
    getRealm().then((instance) => {
      realmInstance = instance;
      const foundObj = instance.objectForPrimaryKey<Checklist>('Checklist', id as string);
      if (foundObj) {
        // Convert Realm object to plain JS and restore Date
        const parsed = JSON.parse(JSON.stringify(foundObj)) as Omit<Checklist, 'createdAt'> & { createdAt: string };
        setChecklist({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        });
      } else {
        setChecklist(null);
      }
    });
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, [id]);

  if (!checklist) {
    return (
      <View style={styles.container}>
        <Text>Nie znaleziono checklisty.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Szczegóły checklisty</Text>
      <Text style={styles.label}>Sklep:</Text>
      <Text style={styles.value}>{checklist.sklep}</Text>
      <Text style={styles.label}>Miasto:</Text>
      <Text style={styles.value}>{checklist.city || '-'}</Text>
      {/*
      <Text style={styles.label}>Data:</Text>
      <Text style={styles.value}>{checklist.data || '-'}</Text>
      */}
      <Text style={styles.label}>MR:</Text>
      <Text style={styles.value}>{checklist.mr || '-'}</Text>
      <Text style={styles.label}>Prowadząca zmianę:</Text>
      <Text style={styles.value}>{checklist.prowadzacaZmiane || '-'}</Text>
      <Text style={styles.label}>% prognoza (asort. podstawowy):</Text>
      <Text style={styles.value}>{checklist.prognozaPodstawowy || '-'}</Text>
      <Text style={styles.label}>% prognoza (asort. komplementarny):</Text>
      <Text style={styles.value}>{checklist.prognozaKomplementarny || '-'}</Text>
      <Text style={styles.label}>% skuteczność sprzedaży chemii:</Text>
      <Text style={styles.value}>{checklist.skutecznoscChemii || '-'}</Text>
      <Text style={styles.label}>Utworzono:</Text>
      <Text style={styles.value}>
        {checklist.createdAt ? new Date(checklist.createdAt).toLocaleString() : '-'}
      </Text>

      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={styles.button}
            onPress={() => {
              // Szczegóły checklisty (readonly)
              if (checklist?.id) {
                router.push({
                  pathname: '/screens/Checklist/CategoryCheckScreen',
                  params: { checklistId: checklist.id, readonly: 'true' },
                });
              }
            }}
          >
            Szczegóły checklisty
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text
            style={[styles.button, { backgroundColor: '#4678c0' }]}
            onPress={() => {
              // Otwórz ponownie checklistę do edycji
              if (checklist?.id) {
                router.push({
                  pathname: '/screens/Checklist/CategoryCheckScreen',
                  params: { checklistId: checklist.id, editMode: 'true' },
                });
              }
            }}
          >
            Otwórz checklistę
          </Text>
        </View>
      </View>
      <View style={styles.buttonFullWidth}>
        <Text
          style={[styles.button, styles.buttonFull]}
          onPress={async () => {
            try {
              let realmInstance;
              realmInstance = await getRealm();
              const found = realmInstance.objectForPrimaryKey('Checklist', checklist.id);
              if (!found) {
                Alert.alert('Błąd', 'Nie znaleziono checklisty');
                return;
              }
              const tasksRaw = realmInstance
                .objects<Task>('Task')
                .filtered('checklistId == $0', checklist.id);
              const tasks = JSON.parse(JSON.stringify(tasksRaw)) as Array<Task & {
                photoUris?: string[];
              }>;
              console.log('Zadania do PDF:', tasks);
              // Zamień zdjęcia na base64 
              const tasksWithBase64 = await Promise.all(
                tasks.map(async (task: Task & { photoUris?: string[] }) => {
                  let photoBase64Arr: string[] = [];
                  const photoUris = task.photoUris ?? [];
                  if (photoUris.length > 0) {
                    for (const uri of photoUris) {
                      try {
                        const info = await FileSystem.getInfoAsync(uri);
                        console.log('photoUri:', uri, 'exists:', info.exists);
                        if (info.exists) {
                          const base64 = await FileSystem.readAsStringAsync(uri, {
                            encoding: FileSystem.EncodingType.Base64,
                          });
                          photoBase64Arr.push(`data:image/jpeg;base64,${base64}`);
                          console.log('photoUri:', uri, 'base64 length:', base64.length);
                        }
                      } catch (e) {
                        console.log('Błąd base64:', e, uri);
                      }
                    }
                  } else {
                    console.log(
                      'Brak photoUris dla zadania:',
                      task.title || task.id,
                    );
                  }
                  return { ...task, photoBase64Arr };
                }),
              );
              // Pogrupuj zadania po kategorii
              const grouped = tasksWithBase64.reduce(
                (acc, task) => {
                  const cat = task.category || 'Inne';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(task);
                  return acc;
                },
                {} as Record<string, any[]>,
              );
              // Wygeneruj HTML
              const html = generateChecklistHTML(checklist, grouped);
              const pdf = await RNHTMLtoPDF.convert({
                html,
                fileName: `checklista_${checklist.sklep}_${checklist.id}`,
                base64: false,
              });
              let filePath = pdf.filePath;
              if (filePath && !filePath.startsWith('file://')) {
                filePath = 'file://' + filePath;
              }
              if (filePath && (await Sharing.isAvailableAsync())) {
                await Sharing.shareAsync(filePath);
              } else {
                Alert.alert(
                  'PDF zapisany',
                  `Plik PDF zapisany w:\n${pdf.filePath}`,
                );
              }
            } catch (e) {
              Alert.alert('Błąd PDF', String(e));
            }
          }}
        >
          Generuj raport PDF
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 32,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4678c0',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
  },
  buttonFullWidth: {
    marginTop: 12,
  },
  buttonFull: {
    width: '100%',
    backgroundColor: '#aaa',
  },
});
