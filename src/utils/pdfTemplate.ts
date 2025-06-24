import * as FileSystem from 'expo-file-system';

export async function prepareTasksWithBase64(tasks: any[]) {
  return Promise.all(
    tasks.map(async (task) => {
      let photoBase64Arr: string[] = [];
      if (Array.isArray(task.photoUris) && task.photoUris.length > 0) {
        for (const uri of task.photoUris) {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            photoBase64Arr.push(`data:image/jpeg;base64,${base64}`);
          } catch (e) {
            console.log('Błąd base64:', e, uri);
          }
        }
      }
      return { ...task, photoBase64Arr };
    }),
  );
}

// (Opcjonalnie) możesz tu dodać funkcję generateChecklistHTML jeśli chcesz mieć całą logikę PDF w jednym pliku.
