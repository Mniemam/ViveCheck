import * as FileSystem from 'expo-file-system';

/**
 * Przygotowuje tablicę zadań, konwertując identyfikatory URI zdjęć na ciągi Base64.
 * @param {any[]} tasks - Tablica obiektów zadań.
 * @returns {Promise<any[]>} Obietnica, która zwraca tablicę zadań z dodaną właściwością `photoBase64Arr`.
 */
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

/**
 * Generuje ciąg HTML dla raportu z listy kontrolnej.
 * @param {any} checklist - Obiekt listy kontrolnej.
 * @param {Record<string, any[]>} groupedTasks - Obiekt z zadaniami pogrupowanymi według kategorii.
 * @returns {string} Ciąg HTML reprezentujący listę kontrolną.
 */
export function generateChecklistHTML(checklist: any, groupedTasks: Record<string, any[]>) {
  return `
    <h1>Checklista: ${checklist.title}</h1>
    <p><b>Data:</b> ${checklist.date || '-'} </p>
    <p><b>Podtytuł:</b> ${checklist.subtitle || '-'}</p>
    <h2>Zadania wg kategorii:</h2>
    ${Object.entries(groupedTasks)
      .map(
        ([cat, tasks]) => `
      <h3>${cat}</h3>
      <ul>
        ${tasks
          .map(
            (task: any) => `
          <li style="margin-bottom:16px;">
            <b>${task.title || '(brak opisu)'}</b><br/>
            ${task.photoBase64Arr && task.photoBase64Arr.length > 0 ? task.photoBase64Arr.map((img: string) => `<img src="${img}" style="max-width:300px;max-height:200px;" /><br/>`).join('') : ''}
            <b>Opis:</b> ${task.notes || '-'}<br/>
          </li>
        `,
          )
          .join('')}
      </ul>
    `,
      )
      .join('')}
  `;
}
