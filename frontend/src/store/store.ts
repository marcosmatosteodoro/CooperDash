import { configureStore } from '@reduxjs/toolkit';
import cooperadosReducer from './slices/cooperadosSlice';

export const store = configureStore({
  reducer: {
    cooperados: cooperadosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;