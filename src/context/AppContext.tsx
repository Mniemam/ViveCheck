import { useEffect } from 'react';
import { loadChecklists, saveChecklist } from '../storage/storageHelpers';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import appReducer from './appReducer';
import { AppState, AppAction } from './types';

// Początkowy stan aplikacji
const initialState: AppState = {
  checklists: [],
};

// Typ kontekstu
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Tworzenie kontekstu
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook do użycia kontekstu
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider kontekstu
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatchBase] = useReducer(appReducer, initialState);

  // wrapujemy dispatch by zapisywał do bazy przy każdej akcji
  const dispatch = (action: AppAction) => {
    if (action.type === 'ADD_CHECKLIST') {
      saveChecklist(action.payload); // zapis do Realm
    }
    dispatchBase(action);
  };

  useEffect(() => {
    const load = async () => {
      const saved = await loadChecklists();
      saved.forEach((c) => {
        dispatchBase({ type: 'ADD_CHECKLIST', payload: c });
      });
    };
    load();
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
