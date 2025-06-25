import appReducer, { initialState, State, Action } from '../src/context/appReducer';
import { Checklist } from '../src/context/types';

describe('appReducer', () => {
  function createChecklist(overrides: Partial<Checklist> = {}): Checklist {
    return {
      id: '1',
      sklep: 'Store 1',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      items: [],
      ...overrides,
    };
  }

  it('powinien_dodać_checklistę_do_pustego_stanu', () => {
    const checklist = createChecklist();
    const action: Action = { type: 'ADD_CHECKLIST', payload: checklist };
    const result = appReducer(initialState, action);
    expect(result.checklists).toHaveLength(1);
    expect(result.checklists[0]).toEqual(checklist);
  });

  it('powinien_dodać_checklistę_do_istniejącej_listy', () => {
    const existingChecklist = createChecklist({ id: '1' });
    const newChecklist = createChecklist({ id: '2', sklep: 'Store 2' });
    const state: State = { checklists: [existingChecklist] };
    const action: Action = { type: 'ADD_CHECKLIST', payload: newChecklist };
    const result = appReducer(state, action);
    expect(result.checklists).toHaveLength(2);
    expect(result.checklists[0]).toEqual(existingChecklist);
    expect(result.checklists[1]).toEqual(newChecklist);
  });

  it('powinien_zwrócić_stan_dla_nieznanej_akcji', () => {
    const state: State = { checklists: [createChecklist()] };
    const action = { type: 'UNKNOWN_ACTION', payload: {} } as unknown as Action;
    const result = appReducer(state, action);
    expect(result).toBe(state);
  });

  it('powinien_dodać_checklistę_z_brakiem_pól_opcjonalnych', () => {
    const checklist: Checklist = {
      id: '3',
      sklep: 'Store 3',
      createdAt: new Date('2024-01-02T00:00:00Z'),
      items: [],
      // Pominięto pola opcjonalne
    };
    const action: Action = { type: 'ADD_CHECKLIST', payload: checklist };
    const result = appReducer(initialState, action);
    expect(result.checklists).toHaveLength(1);
    expect(result.checklists[0]).toEqual(checklist);
  });

  it('powinien_obsłużyć_nieprawidłowy_payload_checklisty', () => {
    const malformedChecklist = {
      sklep: 'No ID',
      createdAt: new Date(),
      items: [],
    } as unknown as Checklist;
    const action: Action = { type: 'ADD_CHECKLIST', payload: malformedChecklist };
    // Reducer doda nieprawidłowy obiekt bez zmian
    const result = appReducer(initialState, action);
    expect(result.checklists).toHaveLength(1);
    expect(result.checklists[0]).toEqual(malformedChecklist);
  });

  it('powinien_obsłużyć_zduplikowane_id_checklisty', () => {
    const checklist1 = createChecklist({ id: 'dup' });
    const checklist2 = createChecklist({ id: 'dup', sklep: 'Store Duplicate' });
    const state: State = { checklists: [checklist1] };
    const action: Action = { type: 'ADD_CHECKLIST', payload: checklist2 };
    const result = appReducer(state, action);
    expect(result.checklists).toHaveLength(2);
    expect(result.checklists[0]).toEqual(checklist1);
    expect(result.checklists[1]).toEqual(checklist2);
    // Obie checklisty z tym samym id są obecne
  });
});
