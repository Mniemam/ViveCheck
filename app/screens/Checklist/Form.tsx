import React, { useState } from 'react';
import { SafeAreaView, Text, Dimensions, Alert } from 'react-native';
import TaskCarousel from '../../../src/components/TaskCarousel';
import { styles } from '../../../src/styles/Checklist/Form.styles';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppContext } from '../../../src/context/AppContext';
import { Checklist, Task } from '@/context/types';
import { v4 as uuidv4 } from 'uuid';
import { useCameraCapture } from '../../../src/hooks/useCamera';
import { useCurrentLocation } from '../../../src/hooks/useLocation';

// Typ route params
type FormRouteParams = {
  Form: {
    category: {
      title: string;
      tasks: Task[];
    };
  };
};

export default function Form() {
  const route = useRoute<RouteProp<FormRouteParams, 'Form'>>();
  const category = route.params?.category ?? { title: '', tasks: [] };

  const { dispatch } = useAppContext();

  const [tasks, setTasks] = useState<Task[]>(category.tasks || []);
  const screenWidth = Dimensions.get('window').width;

  const { takePhoto } = useCameraCapture();
  const { getLocation } = useCurrentLocation();

  // Obsługa zmiany dowolnego pola (string lub boolean)
  const handleChange = (taskIndex: number, field: keyof Task, value: string | boolean) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      [field]: value,
    };
    setTasks(updatedTasks);
  };

  // Dodawanie zdjęcia do zadania
  const handleAddPhoto = async (taskIndex: number) => {
    const uri = await takePhoto();
    if (uri) {
      handleChange(taskIndex, 'photoUri', uri);
    }
  };

  // Zapis checklisty z bezpiecznym sprawdzeniem location
  const handleSave = async () => {
    try {
      const location = await getLocation();
      if (!location) {
        Alert.alert('Brak lokalizacji', 'Nie można pobrać lokalizacji. Sprawdź uprawnienia.');
        return;
      }

      const newChecklist: Checklist = {
        id: uuidv4(),
        title: category.title,
        location,
        items: tasks.map(task => ({
          id: task.id || uuidv4(),
          text: task.title || task.obszar || '(brak opisu)',
          completed: !!task.completed,
        })),
      };

      dispatch({ type: 'ADD_CHECKLIST', payload: newChecklist });
      Alert.alert('Sukces', 'Zapisano checklistę!');
      // Możesz dodać nawigację lub reset stanu tutaj
    } catch (error) {
      console.error('Błąd podczas zapisu checklisty:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać checklisty.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{category.title}</Text>
      <TaskCarousel
        tasks={tasks}
        screenWidth={screenWidth}
        onChange={handleChange}
        onAddPhoto={handleAddPhoto}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}