import Realm from 'realm';
import { LocationSchema, ChecklistItemSchema, ChecklistSchema, TaskSchema } from '../realm/schemas';

export const getRealm = async (): Promise<Realm> => {
  return await Realm.open({
    schema: [
       LocationSchema,
       ChecklistItemSchema,
       ChecklistSchema,
       TaskSchema,
     ],
    schemaVersion: 9,
    onMigration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 9) {
        const checklists = newRealm.objects('Checklist');
        for (let i = 0; i < checklists.length; i++) {
          const checklist = checklists[i];
          if (!checklist.createdAt) checklist.createdAt = new Date();
          if (!checklist.photoUri) checklist.photoUri = '';
          if (checklist.city === undefined) checklist.city = '';
          const items = checklist.items as unknown as any[];
          if (items && items.length > 0) {
            for (let j = 0; j < items.length; j++) {
              const item = items[j];
              if (!item.title) item.title = '(brak opisu)';
              if (typeof item.completed !== 'boolean') item.completed = false;
              if (item.text !== undefined) delete item.text;
              if (item.photoUris !== undefined) delete item.photoUris;
            }
          }
        }
      }
    },
  });
};
