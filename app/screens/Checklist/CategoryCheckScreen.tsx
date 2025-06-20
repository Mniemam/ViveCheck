import React from 'react';
import { Text, Pressable, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { initialCategories, Category } from '../../../src/data/categories';
import { useLocalSearchParams } from 'expo-router';

const CategoryButton = React.memo(({ item, onPress }: { item: Category; onPress: (item: Category) => void }) => (
  <Pressable style={styles.categoryButton} onPress={() => onPress(item)}>
    <Text style={styles.categoryButtonText}>{item.title}</Text>
  </Pressable>
));

export default function CategoryCheckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const checklistId = params.checklistId as string | undefined;
  const readonly = params.readonly === 'true';
  const editMode = params.editMode === 'true';
  const handleSelectCategory = (category: Category) => {
    // Przekieruj do TaskCarouselScreen z checklistId, trybem i kategorią
    router.push({
      pathname: '/screens/Checklist/TaskCarouselScreen',
      params: {
        categoryTitle: category.title,
        checklistId,
        editMode: editMode ? 'true' : undefined,
        readonly: readonly ? 'true' : undefined,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Wybierz kategorię</Text>
      <FlatList
        data={initialCategories}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <CategoryButton item={item} onPress={handleSelectCategory} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6ff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    padding: 16,
  },
  categoryButton: {
    backgroundColor: '#73c0d7',
    padding: 14,
    marginVertical: 6,
    borderRadius: 6,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});