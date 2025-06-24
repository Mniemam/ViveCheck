import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Task } from '../context/types';
import { styles as carouselStyles } from '../styles/Checklist/TaskCarousel.styles';

type TaskCarouselProps = {
  tasks: Task[];
  screenWidth: number;
  onChange?: (taskId: string, field: keyof Task, value: string | boolean | string[]) => void;
  onAddPhoto?: (taskId: string) => void;
  onSave?: (taskId: string) => void;
  readonly?: boolean;
};

const horizontalMargin = 16;

const TaskCarousel: React.FC<TaskCarouselProps> = ({
  tasks,
  screenWidth,
  onChange,
  onAddPhoto,
  onSave,
  readonly,
}) => {
  const cardWidth = screenWidth - 2 * horizontalMargin;
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Synchronize local state with tasks prop
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Update a field in a task by id only
  const updateTaskField = useCallback((taskId: string, field: keyof Task, value: any) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)),
    );
  }, []);
  const handleSave = (taskId: string) => {
    const task = localTasks.find((t) => t.id === taskId);
    if (!task) return;
    // Validate and sanitize before passing to callbacks
    const sanitizedKomentarz = (task.komentarz ?? '').replace(/[<>]/g, '');
    const sanitizedOsobaOdpowiedzialna = (task.osobaOdpowiedzialna ?? '').replace(/[<>]/g, '');
    onChange && onChange(taskId, 'komentarz', sanitizedKomentarz);
    onChange && onChange(taskId, 'osobaOdpowiedzialna', sanitizedOsobaOdpowiedzialna);
    onChange && onChange(taskId, 'photoUris', task.photoUris ?? []);
    onSave && onSave(taskId);
  };

  return (
    <Carousel
      width={cardWidth}
      data={localTasks}
      style={{ width: screenWidth }}
      mode="parallax"
      modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 40 }}
      renderItem={({ item, index }) => (
        <View
          style={[
            carouselStyles.cardContainer,
            { width: cardWidth, marginHorizontal: horizontalMargin },
          ]}
        >
          <View style={carouselStyles.headerContainer}>
            <Text style={carouselStyles.taskTitle}>
              {index + 1}. {item.title || '(brak opisu)'}
            </Text>
            {!!item.termin && <Text style={carouselStyles.termin}>Termin: {item.termin}</Text>}
          </View>

          <TextInput
            style={[carouselStyles.input, carouselStyles.textArea]}
            placeholder="Komentarz"
            value={item.komentarz ?? ''}
            multiline
            numberOfLines={6}
            onChangeText={(val) => {
              const sanitizedVal = val.replace(/[<>]/g, ''); // simple sanitization example
              updateTaskField(item.id, 'komentarz', sanitizedVal);
              onChange && onChange(item.id, 'komentarz', sanitizedVal);
            }}
            editable={!readonly}
            blurOnSubmit={true}
            returnKeyType="done"
          />

          <TextInput
            style={carouselStyles.input}
            placeholder="Osoba odpowiedzialna"
            value={item.osobaOdpowiedzialna ?? ''}
            onChangeText={(val) => {
              const sanitizedVal = val.replace(/[<>]/g, '');
              updateTaskField(item.id, 'osobaOdpowiedzialna', sanitizedVal);
              onChange && onChange(item.id, 'osobaOdpowiedzialna', sanitizedVal);
            }}
            editable={!readonly}
            blurOnSubmit={true}
            returnKeyType="done"
          />

          {!readonly && (
            <Pressable
              style={carouselStyles.photoButton}
              onPress={() => onAddPhoto && onAddPhoto(item.id)}
            >
              <Text style={carouselStyles.photoButtonText}>Dodaj zdjęcie</Text>
            </Pressable>
          )}

          {item.photoUris && item.photoUris.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              {item.photoUris.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{
                    width: 80,
                    height: 80,
                    margin: 4,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}
                />
              ))}
            </View>
          )}

          
          {!readonly && (
            <Pressable
              style={[carouselStyles.photoButton, localStyles.saveButton]}
              onPress={() => handleSave(item.id)}
            >
              <Text style={[carouselStyles.photoButtonText, { color: '#fff' }]}>Zapisz</Text>
            </Pressable>
          )}
        </View>
      )}
    />
  );
};

const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
  },
});

export default TaskCarousel;
