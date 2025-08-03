import { configureStore } from '@reduxjs/toolkit';
import cooperadosReducer from './slices/cooperadosSlice';

export const store = configureStore({
  reducer: {
    cooperados: cooperadosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;