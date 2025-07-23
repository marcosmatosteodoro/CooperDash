import { configureStore } from '@reduxjs/toolkit';
import cooperadosReducer from './slices/cooperadosSlice';

const store = configureStore({
  reducer: {
    cooperados: cooperadosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: []
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;