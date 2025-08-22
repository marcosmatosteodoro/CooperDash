import { configureStore } from '@reduxjs/toolkit';
import cooperadosReducer from './slices/cooperadosSlice';
import assembleiasReducer from './slices/assembleiasSlice';
import emprestimosReducer from './slices/emprestimosSlice';
import enderecosReducer from './slices/enderecosSlice';
import transacoesReducer from './slices/transacoesSlice';
import votacoesReducer from './slices/votacoesSlice';
import contasCorrentesReducer from './slices/contasCorrentesSlice';
import parcelasEmprestimosReducer from './slices/parcelasEmprestimosSlice';

export const store = configureStore({
  reducer: {
    cooperados: cooperadosReducer,
    assembleias: assembleiasReducer,
    emprestimos: emprestimosReducer,
    enderecos: enderecosReducer,
    transacoes: transacoesReducer,
    votacoes: votacoesReducer,
    contasCorrentes: contasCorrentesReducer,
    parcelasEmprestimos: parcelasEmprestimosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;