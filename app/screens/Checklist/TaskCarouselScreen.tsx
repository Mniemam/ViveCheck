import React, { useState } from 'react';
import Realm from 'realm';
import { useLocalSearchParams } from 'expo-router';
import { Dimensions, SafeAreaView, Text, Alert, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TaskCarousel from '../../../src/components/TaskCarousel';
import { getRealm } from '../../../src/data/realm';
import { Task } from '../../../src/context/types';
import { styles } from '../../../src/styles/Checklist/TaskForm.styles';
import { useCameraCapture } from '../../../src/hooks/useCamera';

export default function TaskCarouselScreen() {
  const params = useLocalSearchParams();
  const checklistId = params.checklistId as string | undefined;
  const editMode = params.editMode === 'true';
  const readonlyParam = params.readonly === 'true';
  const categoryTitle = params.categoryTitle as string | undefined;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [header, setHeader] = useState<string>('');
  const [checklist, setChecklist] = useState<any>(null);
  const screenWidth = Dimensions.get('window').width;
  const [realm, setRealm] = useState<any | null>(null);
  const [readonly, setReadonly] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let realmInstance: any;
      getRealm().then((instance) => {
        setRealm(instance);
        realmInstance = instance;
        if (checklistId) {
          let realmTasks: any = instance.objects('Task');
          realmTasks = realmTasks.filtered('checklistId == $0', checklistId);
          if (categoryTitle) {
            realmTasks = realmTasks.filtered('category == $0', categoryTitle);
          }
          setTasks([...JSON.parse(JSON.stringify(realmTasks))]);
          setReadonly(readonlyParam ? true : !editMode);
          const foundChecklist = instance.objects('Checklist').filtered('id == $0', checklistId)[0];
          if (foundChecklist) {
            setHeader(
              (foundChecklist.category as string) || (foundChecklist.sklep as string) || '',
            );
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
    }, [checklistId, readonlyParam, editMode, categoryTitle]),
  );

  // Obsługa zmian pól zadania
  const handleChange = (taskId: string, field: keyof Task, value: string | boolean | string[]) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      [field]: value,
    };
    setTasks(updatedTasks);
    if (realm && updatedTasks[taskIndex].id && checklistId) {
      try {
        realm.write(() => {
          const realmTask = realm.objectForPrimaryKey('Task', updatedTasks[taskIndex].id) as Task | undefined;
          if (realmTask) {
            (realmTask as any)[field] = value;
          }
        });
        let realmTasks: any = realm.objects('Task').filtered('checklistId == $0', checklistId);
        if (categoryTitle) {
          realmTasks = realmTasks.filtered('category == $0', categoryTitle);
        }
        setTasks([...JSON.parse(JSON.stringify(realmTasks))]);
      } catch (error) {
        console.error('Błąd zapisu do Realm:', error);
      }
    }
  };

  // Dodawanie zdjęcia do zadania
  const { takePhoto } = useCameraCapture();
  const handleAddPhoto = async (taskId: string) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      Alert.alert('Błąd', 'Nie znaleziono zadania do dodania zdjęcia.');
      return;
    }
    try {
      const photoUri = await takePhoto();
      if (photoUri) {
        const updatedTasks = [...tasks];
        const prevUris = Array.isArray(updatedTasks[taskIndex].photoUris)
          ? updatedTasks[taskIndex].photoUris
          : [];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          photoUris: [...prevUris, photoUri],
        };
        setTasks(updatedTasks);
        if (realm && updatedTasks[taskIndex].id && checklistId) {
          try {
            realm.write(() => {
              const realmTask = realm.objectForPrimaryKey('Task', updatedTasks[taskIndex].id) as Task | undefined;
              if (realmTask) {
                realmTask.photoUris = [...prevUris, photoUri];
              }
            });
            let realmTasks: any = realm.objects('Task').filtered('checklistId == $0', checklistId);
            if (categoryTitle) {
              realmTasks = realmTasks.filtered('category == $0', categoryTitle);
            }
            setTasks([...JSON.parse(JSON.stringify(realmTasks))]);
          } catch {
            // obsługa błędu
          }
        }
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać zdjęcia.');
    }
  };

  // Zapisz zmiany zadania do Realm
  const handleSaveTask = (taskId: string) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    if (!realm) {
      Alert.alert('Błąd', 'Baza danych nie jest gotowa.');
      return;
    }
    let task = tasks[taskIndex];
    if (checklistId) {
      task = { ...task, checklistId };
    }
    try {
      console.log('Zapis do Realm, task:', {
        id: task.id,
        checklistId: task.checklistId,
        category: task.category,
        komentarz: task.komentarz,
        photoUris: task.photoUris,
        osobaOdpowiedzialna: task.osobaOdpowiedzialna,
      });
      realm.write(() => {
        let realmTask = realm.objectForPrimaryKey('Task', task.id) as Task | undefined;
        if (realmTask) {
          realmTask.komentarz = task.komentarz;
          realmTask.photoUris = [...(task.photoUris || [])];
          realmTask.osobaOdpowiedzialna = task.osobaOdpowiedzialna;
        } else {
          realm.create('Task', task);
        }
      });
      Alert.alert('Sukces', 'Zadanie zapisane w bazie aplikacji.');
    } catch (error) {
      console.error('Błąd zapisu do bazy aplikacji:', error);
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
        <View
          style={{ marginBottom: 16, backgroundColor: '#f6f6f6', borderRadius: 8, padding: 12 }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            Utworzono:{' '}
            <Text style={{ fontWeight: 'normal' }}>
              {checklist.createdAt ? new Date(checklist.createdAt).toLocaleString() : '-'}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#555',
              marginTop: 4,
              textAlign: 'left',
            }}
          >
            Sklep: {checklist.sklep}
            {checklist.city ? `, ${checklist.city}` : ''}
          </Text>
        </View>
      )}
      {categoryTitle && (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              backgroundColor: '#73c0d7',
              color: '#000',
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              borderRadius: 6,
              marginBottom: 12,
              paddingVertical: 8,
              width: screenWidth * 0.85,
              maxWidth: 600,
            }}
          >
            {categoryTitle}
          </Text>
        </View>
      )}
      <TaskCarousel
        tasks={tasks}
        screenWidth={screenWidth}
        onChange={
          readonly
            ? undefined
            : (handleChange as (
                taskId: string,
                field: keyof Task,
                value: string | boolean | string[],
              ) => void)
        }
        onAddPhoto={readonly ? undefined : handleAddPhoto}
        onSave={readonly ? undefined : handleSaveTask}
        readonly={readonly}
      />
    </SafeAreaView>
  );
}
