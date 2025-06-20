import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Task } from '../context/types';
import { styles as carouselStyles } from '../styles/Checklist/TaskCarousel.styles';

type TaskCarouselProps = {
  tasks: Task[];
  screenWidth: number;
  onChange?: (taskIndex: number, field: keyof Task, value: string | boolean) => void;
  onAddPhoto?: (taskIndex: number) => void;
  onSave?: (taskIndex: number) => void;
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

  const updateTaskField = useCallback(
    (index: number, field: keyof Task, value: string | boolean) => {
      setLocalTasks(prev =>
        prev.map((task, i) =>
          i === index ? { ...task, [field]: value } : task
        )
      );
    },
    []
  );

  const handleCheckbox = (index: number) => {
    updateTaskField(index, 'completed', !(localTasks[index].completed ?? false));
  };

  const handleSave = (index: number) => {
    const task = localTasks[index];
    onChange && onChange(index, 'completed', !!task.completed);
    onChange && onChange(index, 'photoUri', task.photoUri ?? '');
    onChange && onChange(index, 'komentarz', task.komentarz ?? '');
    onChange && onChange(index, 'osobaOdpowiedzialna', task.osobaOdpowiedzialna ?? '');
    onSave && onSave(index);
  };

  const renderCheckbox = (completed: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      style={[
        localStyles.checkbox,
        completed && localStyles.checkboxChecked,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!completed }}
    >
      {completed && <Text style={localStyles.checkboxTick}>✓</Text>}
    </Pressable>
  );

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
              {index + 1}. {item.obszar || item.title || '(brak opisu)'}
            </Text>
            {!!item.termin && (
              <Text style={carouselStyles.termin}>Termin: {item.termin}</Text>
            )}
          </View>

          <TextInput
            style={[carouselStyles.input, carouselStyles.textArea]}
            placeholder="Komentarz"
            value={item.komentarz ?? ''}
            multiline
            numberOfLines={6}
            onChangeText={val => {
              updateTaskField(index, 'komentarz', val);
              onChange && onChange(index, 'komentarz', val);
            }}
            editable={!readonly}
            blurOnSubmit={true}
            returnKeyType="done"
          />

          <TextInput
            style={carouselStyles.input}
            placeholder="Osoba odpowiedzialna"
            value={item.osobaOdpowiedzialna ?? ''}
            onChangeText={val => {
              updateTaskField(index, 'osobaOdpowiedzialna', val);
              onChange && onChange(index, 'osobaOdpowiedzialna', val);
            }}
            editable={!readonly}
            blurOnSubmit={true}
            returnKeyType="done"
          />

          {!readonly && (
            <Pressable style={carouselStyles.photoButton} onPress={() => onAddPhoto && onAddPhoto(index)}>
              <Text style={carouselStyles.photoButtonText}>Dodaj zdjęcie</Text>
            </Pressable>
          )}

          {!!item.photoUri && (
            <Image source={{ uri: item.photoUri }} style={carouselStyles.photo} />
          )}

          <View style={localStyles.row}>
            {renderCheckbox(!!localTasks[index].completed, () => handleCheckbox(index))}
            <Text>Wykonane</Text>
          </View>

          {!readonly && (
            <Pressable
              style={[carouselStyles.photoButton, localStyles.saveButton]}
              onPress={() => handleSave(index)}
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
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
  },
});

export default TaskCarousel;