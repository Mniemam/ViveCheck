


import { Checklist } from '@/context/types';

export const generateChecklistHTML = (checklist: Checklist): string => {
  const tasksHTML = checklist.items
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.title}</td>
        <td>${item.completed ? '✔️' : '❌'}</td>
      </tr>`
    )
    .join('');

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { font-size: 24px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <h1>${checklist.title}</h1>
        <p>Data utworzenia: ${new Date(checklist.createdAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</p>
        <table>
          <thead>
            <tr><th>#</th><th>Zadanie</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${tasksHTML}
          </tbody>
        </table>
      </body>
    </html>
  `;
};