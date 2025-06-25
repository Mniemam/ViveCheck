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

export function generateChecklistHTML(checklist: any, groupedTasks: Record<string, any[]>) {
  return `
    <h1>Checklista: ${checklist.sklep}</h1>
    <p><b>Data:</b> ${checklist.createdAt ? new Date(checklist.createdAt).toLocaleString() : '-'} </p>
    <p><b>MR:</b> ${checklist.mr || '-'}<br/>
    <b>Prowadząca zmianę:</b> ${checklist.prowadzacaZmiane || '-'}<br/>
    <b>% prognoza (asort. podstawowy):</b> ${checklist.prognozaPodstawowy || '-'}<br/>
    <b>% prognoza (asort. komplementarny):</b> ${checklist.prognozaKomplementarny || '-'}<br/>
    <b>% skuteczność sprzedaży chemii:</b> ${checklist.skutecznoscChemii || '-'}<br/></p>
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
            <b>Opis:</b> ${task.komentarz || '-'}<br/>
            <b>Wykonał:</b> ${task.osobaOdpowiedzialna || '-'}<br/>
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
