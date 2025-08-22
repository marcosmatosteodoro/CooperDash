import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import TransacoesService from '@/services/transacoesService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { Transacao } from '@/types/app/transacao';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<Transacao> = {
  pagination: {} as PaginatedResponse<Transacao>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchTransacoes = createAsyncThunk<PaginatedResponse<Transacao>, PaginationParams>(
  'transacoes/fetchAll',
  async (params) => {
    const response = await TransacoesService.getAll(params);
    return response.data;
  }
);

export const fetchTransacao = createAsyncThunk<Transacao, string>(
  'transacoes/fetchOne',
  async (id: string) => {
    const response = await TransacoesService.getById(id);
    return response.data;
  }
);

export const createTransacao = createAsyncThunk<Transacao, Omit<Transacao, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'transacoes/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await TransacoesService.create(data);
      return response.data;
    } catch (error: unknown) {
      const err = error as SliceError;

      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: err.message });
    }
  }
);

export const updateTransacao = createAsyncThunk<
  Transacao,
  { id: string; data: Partial<Transacao> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'transacoes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await TransacoesService.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const err = error as SliceError;

      if (err.response) {
        const payload = err.response.data || {};
        return rejectWithValue({
          message: payload.message || 'Erro na atualização',
          errors: payload.errors || {},
        });
      }
      return rejectWithValue({
        message: err.message || 'Erro desconhecido',
        errors: {},
      });
    }
  }
);

export const deleteTransacao = createAsyncThunk<string, string>(
  'transacoes/delete',
  async (id: string) => {
    await TransacoesService.delete(id);
    return id;
  }
);

// Slice
const transacoesSlice = createSlice({
  name: 'transacoes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
    clearFieldErrors: (state) => {
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransacoes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransacoes.fulfilled, (state, action: PayloadAction<PaginatedResponse<Transacao>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchTransacoes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar transacoes';
      })

      .addCase(fetchTransacao.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransacao.fulfilled, (state, action: PayloadAction<Transacao>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createTransacao.fulfilled, (state, action: PayloadAction<Transacao>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateTransacao.fulfilled, (state, action: PayloadAction<Transacao>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteTransacao.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.pagination.data = state.pagination.data.filter(c => c.id !== action.payload);
        state.current = null;
        state.error = null;
        state.fieldErrors = null;
      })

      .addMatcher(
        (action): action is RejectValue  => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload?.message || action.error?.message || 'Erro desconhecido';

          if (action.payload?.errors) {
            state.fieldErrors = action.payload.errors;
          } else {
            state.fieldErrors = null;
          }
        }
      );
  },
});

export default transacoesSlice.reducer;