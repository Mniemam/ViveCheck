import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Dimensions, SafeAreaView, Text, Alert, View, Keyboard, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TaskCarousel from '../../../src/components/TaskCarousel';
import { initialCategories } from '../../../src/data/categories';
import { Task } from '../../../src/context/types';
import { styles } from '../../../src/styles/Checklist/Form.styles';
import * as FileSystem from 'expo-file-system';
import { useCameraCapture } from '../../../src/hooks/useCamera';
// import * as ImagePicker from 'expo-image-picker';
import Realm from 'realm';
import { TaskSchema } from '../../../src/realm/Task';
import { ChecklistSchema } from '../../../src/realm/Checklist';

export default function TaskCarouselScreen() {
  const params = useLocalSearchParams();
  const checklistId = params.checklistId as string | undefined;
  const editMode = params.editMode === 'true';
  const readonlyParam = params.readonly === 'true';
  const categoryTitle = params.categoryTitle as string | undefined;
  const category = categoryTitle ? initialCategories.find(cat => cat.title === categoryTitle) : undefined;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [header, setHeader] = useState<string>('');
  const [checklist, setChecklist] = useState<any>(null);
  const screenWidth = Dimensions.get('window').width;
  const [realm, setRealm] = useState<Realm | null>(null);
  const [readonly, setReadonly] = useState(false);

  // Otwórz Realm i pobierz dane za każdym razem, gdy ekran jest aktywny
  useFocusEffect(
    React.useCallback(() => {
      let realmInstance: Realm;
      Realm.open({ 
      schema: [TaskSchema, ChecklistSchema],
      schemaVersion: 4,
      deleteRealmIfMigrationNeeded: true,
      }).then(instance => {
        setRealm(instance);
        realmInstance = instance;
        if (checklistId) {
        // Pobierz zadania z bazy po checklistId i categoryTitle (jeśli jest)
        let realmTasks = instance.objects<Task>('Task').filtered('checklistId == $0', checklistId);
        if (categoryTitle) {
        realmTasks = realmTasks.filtered('category == $0', categoryTitle);
        }
        setTasks(JSON.parse(JSON.stringify(realmTasks)));
        setReadonly(readonlyParam ? true : !editMode);
          // Pobierz checklistę i ustaw nagłówek oraz szczegóły
          const foundChecklist = instance.objects('Checklist').filtered('id == $0', checklistId)[0];
          if (foundChecklist) {
            setHeader((foundChecklist.category as string) || (foundChecklist.sklep as string) || '');
            setChecklist({ ...foundChecklist });
          } else {
            setHeader('');
            setChecklist(null);
          }
        } else {
          setTasks([]);
          setReadonly(false);
          setHeader('');
        }
      });
      return () => {
        if (realmInstance && !realmInstance.isClosed) {
          realmInstance.close();
        }
      };
    }, [checklistId, readonlyParam, editMode])
  );

  // Obsługa zmian pól zadania
  const handleChange = (taskIndex: number, field: keyof Task, value: string | boolean) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      [field]: value,
    };
    setTasks(updatedTasks);
    // Trwały zapis do Realm
    if (realm && updatedTasks[taskIndex].id && checklistId) {
      try {
        realm.write(() => {
          const realmTask = realm.objectForPrimaryKey<Task>('Task', updatedTasks[taskIndex].id);
          if (realmTask) {
            (realmTask as any)[field] = value;
          }
        });
        // Odśwież tasks z bazy po zapisie (wymuś nową referencję)
        const realmTasks = realm.objects<Task>('Task').filtered('checklistId == $0', checklistId);
        setTasks([...JSON.parse(JSON.stringify(realmTasks))]);
      } catch (error) {
        console.error('Błąd zapisu do Realm:', error);
      }
    }
  };

  // Dodawanie zdjęcia do zadania
  const { takePhoto } = useCameraCapture();
  const handleAddPhoto = async (taskIndex: number) => {
    try {
      const photoUri = await takePhoto();
      if (photoUri) {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          photoUri,
        };
        setTasks(updatedTasks);
        // Trwały zapis do Realm
        if (realm && updatedTasks[taskIndex].id && checklistId) {
          try {
            realm.write(() => {
              const realmTask = realm.objectForPrimaryKey<Task>('Task', updatedTasks[taskIndex].id);
              if (realmTask) {
                (realmTask as any).photoUri = photoUri;
              }
            });
            // Odśwież tasks z bazy po zapisie
            const realmTasks = realm.objects<Task>('Task').filtered('checklistId == $0', checklistId);
            setTasks(JSON.parse(JSON.stringify(realmTasks)));
          } catch (error) {
            console.error('Błąd zapisu zdjęcia do Realm:', error);
          }
        }
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać zdjęcia.');
    }
  };

  // Zapisz zmiany zadania do Realm
  const handleSaveTask = (taskIndex: number) => {
    if (!realm) {
      Alert.alert('Błąd', 'Baza danych nie jest gotowa.');
      return;
    }
    let task = tasks[taskIndex];
    // Ustaw checklistId jeśli jest dostępny
    if (checklistId) {
      task = { ...task, checklistId };
    }
    try {
      console.log('Zapis do Realm, task:', {
        id: task.id,
        checklistId: task.checklistId,
        category: task.category,
        komentarz: task.komentarz,
        photoUri: task.photoUri,
        osobaOdpowiedzialna: task.osobaOdpowiedzialna,
        completed: task.completed,
      });
      realm.write(() => {
        // Szukamy po id, jeśli nie ma - tworzymy nowy rekord
        let realmTask = realm.objectForPrimaryKey<Task>('Task', task.id);
        if (realmTask) {
          // Aktualizuj wszystkie istotne pola zadania
          realmTask.komentarz = task.komentarz;
          realmTask.photoUri = task.photoUri;
          realmTask.osobaOdpowiedzialna = task.osobaOdpowiedzialna;
          realmTask.completed = task.completed;
          // Dodaj inne pola jeśli są
        } else {
          // Dodanie nowego zadania
          realm.create('Task', task);
        }
      });
      Alert.alert('Sukces', 'Zadanie zapisane w bazie Realm.');
    } catch (error) {
      console.error('Błąd zapisu do Realm:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać zadania w bazie.');
    }
  };

  if (!tasks.length) {
    return <Text style={{ padding: 24 }}>Brak zadań do wyświetlenia.</Text>;
  }

  return (
  <SafeAreaView key={checklistId + '_' + (readonly ? 'r' : 'e')} style={styles.container}>
    <Text style={styles.header}>{header}</Text>
    {checklist && (
      <View style={{ marginBottom: 16, backgroundColor: '#f6f6f6', borderRadius: 8, padding: 12 }}>
        <Text style={{ fontWeight: 'bold' }}>Utworzono: <Text style={{ fontWeight: 'normal' }}>{checklist.createdAt ? new Date(checklist.createdAt).toLocaleString() : '-'}</Text></Text>
      </View>
    )}
    <TaskCarousel
      tasks={tasks}
      screenWidth={screenWidth}
      onChange={readonly ? undefined : handleChange}
      onAddPhoto={readonly ? undefined : handleAddPhoto}
      onSave={readonly ? undefined : handleSaveTask}
      readonly={readonly}
    />
  </SafeAreaView>
  );
}