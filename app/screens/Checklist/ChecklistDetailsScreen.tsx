import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Realm from 'realm';
import { ChecklistSchema, Checklist } from '../../../src/realm/Checklist';
import { TaskSchema } from '../../../src/realm/Task';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChecklistDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [checklist, setChecklist] = useState<Checklist | null>(null);

  useEffect(() => {
    let realmInstance: Realm;
    Realm.open({ 
      schema: [ChecklistSchema, TaskSchema],
      schemaVersion: 4,
      deleteRealmIfMigrationNeeded: true,
    }).then(instance => {
      realmInstance = instance;
      const found = instance.objectForPrimaryKey<Checklist>('Checklist', id as string);
      setChecklist(found ? { ...found } : null);
          });
    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, [id]);

  if (!checklist) {
    return <View style={styles.container}><Text>Nie znaleziono checklisty.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Szczegóły checklisty</Text>
      <Text style={styles.label}>Sklep:</Text>
      <Text style={styles.value}>{checklist.sklep}</Text>
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
      <Text style={styles.value}>{checklist.createdAt ? new Date(checklist.createdAt).toLocaleString() : '-'}</Text>
        <View style={styles.buttonRow}>
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text style={styles.button} onPress={() => {
          // Szczegóły checklisty (readonly)
          if (checklist?.id) {
            router.push({
              pathname: '/screens/Checklist/CategoryCheckScreen',
              params: { checklistId: checklist.id, readonly: 'true' }
            });
          }
        }}>Szczegóły checklisty</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={[styles.button, { backgroundColor: '#4678c0' }]} onPress={() => {
          // Otwórz ponownie checklistę do edycji
          if (checklist?.id) {
            router.push({
              pathname: '/screens/Checklist/CategoryCheckScreen',
              params: { checklistId: checklist.id, editMode: 'true' }
            });
          }
        }}>Otwórz checklistę</Text>
      </View>
    </View>
    <View style={styles.buttonFullWidth}>
      <Text
        style={[styles.button, styles.buttonFull]}
        onPress={async () => {
          try {
            let realmInstance;
            const { ChecklistSchema } = await import('../../../src/realm/Checklist');
            const { TaskSchema } = await import('../../../src/realm/Task');
            const Realm = (await import('realm')).default;
            realmInstance = await Realm.open({
              schema: [ChecklistSchema, TaskSchema],
              schemaVersion: 4,
              deleteRealmIfMigrationNeeded: true,
            });
            const found = realmInstance.objectForPrimaryKey('Checklist', checklist.id);
            const tasks = realmInstance.objects('Task').filtered('checklistId == $0', checklist.id);
            // Zamień zdjęcia na base64
            const tasksWithBase64 = await Promise.all(
              tasks.map(async (task) => {
                let photoBase64 = '';
                if (task.photoUri) {
                  try {
                    const base64 = await FileSystem.readAsStringAsync(task.photoUri, { encoding: FileSystem.EncodingType.Base64 });
                    photoBase64 = `data:image/jpeg;base64,${base64}`;
                    console.log('photoUri:', task.photoUri, 'base64 length:', base64.length);
                  } catch (e) {
                    console.log('Błąd base64:', e, task.photoUri);
                  }
                } else {
                  console.log('Brak photoUri dla zadania:', task.title || task.obszar || task.id);
                }
                return { ...task, photoBase64 };
              })
            );
            // Pogrupuj zadania po kategorii
            const grouped = tasksWithBase64.reduce((acc, task) => {
              const cat = task.category || 'Inne';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(task);
              return acc;
            }, {} as Record<string, any[]>);
            // Wygeneruj HTML
            const html = `
              <h1>Checklista: ${found.sklep}</h1>
              <p><b>Data:</b> ${found.createdAt ? new Date(found.createdAt).toLocaleString() : '-'}</p>
              <p><b>MR:</b> ${found.mr || '-'}<br/>
              <b>Prowadząca zmianę:</b> ${found.prowadzacaZmiane || '-'}<br/>
              <b>% prognoza (asort. podstawowy):</b> ${found.prognozaPodstawowy || '-'}<br/>
              <b>% prognoza (asort. komplementarny):</b> ${found.prognozaKomplementarny || '-'}<br/>
              <b>% skuteczność sprzedaży chemii:</b> ${found.skutecznoscChemii || '-'}<br/></p>
              <h2>Zadania wg kategorii:</h2>
              ${Object.entries(grouped).map(([cat, tasks]) => `
                <h3>${cat}</h3>
                <ul>
                  ${tasks.map(task => `
                    <li style="margin-bottom:16px;">
                      <b>${task.obszar || task.title || '(brak opisu)'}</b><br/>
                      ${task.photoBase64 ? `<img src="${task.photoBase64}" style="max-width:300px;max-height:200px;" /><br/>` : ''}
                      <b>Opis:</b> ${task.komentarz || '-'}<br/>
                      <b>Wykonał:</b> ${task.osobaOdpowiedzialna || '-'}<br/>
                    </li>
                  `).join('')}
                </ul>
              `).join('')}
            `;
            const pdf = await RNHTMLtoPDF.convert({
              html,
              fileName: `checklista_${found.sklep}_${found.id}`,
              base64: false,
            });
            let filePath = pdf.filePath;
            if (filePath && !filePath.startsWith('file://')) {
              filePath = 'file://' + filePath;
            }
            if (filePath && await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(filePath);
            } else {
              Alert.alert('PDF zapisany', `Plik PDF zapisany w:
${pdf.filePath}`);
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
  label: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
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
