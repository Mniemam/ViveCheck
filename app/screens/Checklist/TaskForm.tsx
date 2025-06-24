import React, { useState } from 'react';
import { SafeAreaView, Text, Dimensions, Alert, View } from 'react-native';
import TaskCarousel from '../../../src/components/TaskCarousel';
import { styles } from '../../../src/styles/Checklist/TaskForm.styles';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppContext } from '../../../src/context/AppContext';
import { Checklist, Task } from '@/context/types';
import { v4 as uuidv4 } from 'uuid';
import { useCameraCapture } from '../../../src/hooks/useCamera';
import { useCurrentLocation } from '../../../src/hooks/useLocation';
import { saveChecklist } from '../../../src/storage/storageHelpers'; 

// Typ route params
type TaskFormRouteParams = {
  TaskForm: {
    category: {
      title: string;
      tasks: Task[];
    };
  };
};

export default function TaskForm() {
  const route = useRoute<RouteProp<TaskFormRouteParams, 'TaskForm'>>();
  const category = route.params?.category ?? { title: '', tasks: [] };

  const { dispatch } = useAppContext();

  const [tasks, setTasks] = useState<Task[]>(category.tasks || []);
  const screenWidth = Dimensions.get('window').width;

  const { takePhoto } = useCameraCapture();
  const { getLocation } = useCurrentLocation();

  // Obsługa zmiany dowolnego pola (string lub boolean)
  const handleChange: (
    taskId: string,
    field: keyof Task,
    value: string | boolean | string[],
  ) => void = (taskId, field, value) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      [field]: value,
    };
    setTasks(updatedTasks);
  };

  // Dodawanie zdjęcia do zadania
  const handleAddPhoto = async (taskId: string) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    const uri = await takePhoto();
    if (uri) {
      const prevUris = tasks[taskIndex].photoUris || [];
      handleChange(taskId, 'photoUris', [...prevUris, uri]);
    }
  };

  // Zapis checklisty ze sprawdzeniem location
  const handleSave = async () => {
    try {
      const location = await getLocation();
      if (!location) {
        Alert.alert('Brak lokalizacji', 'Nie można pobrać lokalizacji. Sprawdź uprawnienia.');
        return;
      }

      const newChecklist: Checklist = {
        id: uuidv4(),
        sklep: category.title,
        createdAt: new Date(),
        location,
        items: tasks.map((task) => ({
          id: task.id || uuidv4(),
          title: task.title || '(brak opisu)',
          komentarz: task.komentarz || '',
          osobaOdpowiedzialna: task.osobaOdpowiedzialna || '',
          completed: false,
        })),
      };
      //Zapis do Raelm
      await saveChecklist(newChecklist); 
      dispatch({ type: 'ADD_CHECKLIST', payload: newChecklist });
      Alert.alert('Sukces', 'Zapisano checklistę!');
    } catch (error) {
      console.error('Błąd podczas zapisu checklisty:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać checklisty.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{category.title}</Text>
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
            width: screenWidth - 160,
            maxWidth: 320,
          }}
        >
          {category.title}
        </Text>
      </View>
      <TaskCarousel
        tasks={tasks}
        screenWidth={screenWidth}
        onChange={
          handleChange as (
            taskId: string,
            field: keyof Task,
            value: string | boolean | string[],
          ) => void
        }
        onAddPhoto={handleAddPhoto}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}