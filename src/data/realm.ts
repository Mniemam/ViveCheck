import Realm from 'realm';
import { checklistSchema } from './checklistSchema';

export const getRealm = async (): Promise<Realm> => {
  return await Realm.open({
    schema: [checklistSchema],
    schemaVersion: 4,
    deleteRealmIfMigrationNeeded: true,
  });
};
