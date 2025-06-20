import Realm from "realm";

// Opcjonalnie: możesz zachować klasę, jeśli korzystasz z metod instancyjnych, ale do konfiguracji Realm używaj obiektu TaskSchema
export const TaskSchema = {
  name: "Task",
  primaryKey: "id",
  properties: {
    id: "string",
    checklistId: "string?",
    title: "string",
    completed: "bool", // poprawka: tylko "bool", bez default!
    photoUri: "string?",
    description: "string?",
    value: "string?",
    obszar: "string?",
    termin: "string?",
    komentarz: "string?",
    osobaOdpowiedzialna: "string?",
    category: "string?",
  },
};

// Jeśli chcesz korzystać z klasy (np. dla typowania), możesz ją zostawić, ale nie przekazuj jej do Realm.open
export class TaskRealmObject extends Realm.Object<TaskRealmObject> {
  id!: string;
  checklistId?: string;
  title!: string;
  completed!: boolean;
  photoUri?: string;
  description?: string;
  value?: string;
  obszar?: string;
  termin?: string;
  komentarz?: string;
  osobaOdpowiedzialna?: string;

  static schema = TaskSchema;
}