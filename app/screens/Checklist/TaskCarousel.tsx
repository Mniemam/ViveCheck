import React from 'react';
import { View, Text, TextInput, Pressable, Image, FlatList } from 'react-native';
import { styles } from './TaskCarousel.styles';
import { Task } from '../../../src/context/types';

type TaskCarouselProps = {
  tasks: Task[];
  screenWidth: number;
  onChange: (taskIndex: number, field: keyof Task, value: string) => void;
  onAddPhoto: (taskIndex: number) => void;
  onSave?: () => void;
};

function TaskCarousel({ tasks, screenWidth, onChange, onAddPhoto, onSave }: TaskCarouselProps) {
  const cardContainerStyle = {
    ...styles.cardContainer,
    width: screenWidth * 0.85,
    marginHorizontal: screenWidth * 0.075,
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View style={cardContainerStyle}> 
          <View style={styles.headerContainer}>
            <Text style={styles.taskTitle}>
              {index + 1}. {item.obszar || '(brak opisu)'}
            </Text>
            {item.termin ? <Text style={styles.termin}>Termin: {item.termin}</Text> : null}
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Komentarz"
            value={item.komentarz}
            multiline
            numberOfLines={6}
            onChangeText={(val) => onChange(index, 'komentarz', val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Osoba odpowiedzialna"
            value={item.osobaOdpowiedzialna}
            onChangeText={(val) => onChange(index, 'osobaOdpowiedzialna', val)}
          />

          <Pressable style={styles.photoButton} onPress={() => onAddPhoto(index)}>
            <Text style={styles.photoButtonText}>Dodaj zdjęcie</Text>
          </Pressable>

          {item.photoUri ? (
            <Image source={{ uri: item.photoUri }} style={styles.photo} />
          ) : null}
        </View>
      )}
    />
  );
}

export default TaskCarousel;
