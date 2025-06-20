// src/context/appReducer.ts

import { Checklist } from './types';

export type State = {
  checklists: Checklist[];
};

export type Action =
  | { type: 'ADD_CHECKLIST'; payload: Checklist }
  // tu możesz dodać kolejne typy akcji (np. REMOVE_CHECKLIST, UPDATE_CHECKLIST itp.)

export const initialState: State = {
  checklists: [],
};

export default function appReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case 'ADD_CHECKLIST':
      return {
        ...state,
        checklists: [...state.checklists, action.payload],
      };
    default:
      return state;
  }
}