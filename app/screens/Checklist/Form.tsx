import React, { useState } from 'react';
import { SafeAreaView, View, Text, Dimensions } from 'react-native';
import TaskCarousel from './TaskCarousel';
import { styles } from './Form.styles';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppContext } from '@/context/AppContext';
import { Checklist } from '@/context/types';
import { Task } from '@/context/types';
import { v4 as uuidv4 } from 'uuid';
import { useCameraCapture } from '@/hooks/useCamera';
import { useCurrentLocation } from '@/hooks/useLocation';



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
  const { category } = route.params;

  const { dispatch } = useAppContext();

  const [tasks, setTasks] = useState<Task[]>(category.tasks);
  const screenWidth = Dimensions.get('window').width;

  const { takePhoto } = useCameraCapture();
  const { getLocation } = useCurrentLocation();

  const handleChange = (taskIndex: number, field: keyof Task, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      [field]: value,
    };
    setTasks(updatedTasks);
  };

  const handleAddPhoto = async (taskIndex: number) => {
    const uri = await takePhoto();
    if (uri) {
      handleChange(taskIndex, 'photoUri', uri);
    }
  };

  const handleSave = async () => {
    try {
      const location = await getLocation();

      const newChecklist: Checklist = {
        id: uuidv4(),
        title: category.title,
        createdAt: new Date(),
        location: location ?? undefined,
        items: tasks.map(task => ({
          id: uuidv4(),
          title: task.obszar,
          completed: false,
        })),
      };

      dispatch({ type: 'ADD_CHECKLIST', payload: newChecklist });
      console.log('Zapisano checklistę:', newChecklist);
    } catch (error) {
      console.error('Błąd podczas zapisu checklisty:', error);
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
