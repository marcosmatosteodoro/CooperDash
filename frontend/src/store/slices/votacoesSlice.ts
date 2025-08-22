import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import VotacoesService from '@/services/votacoesService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { Votacao } from '@/types/app/votacao';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<Votacao> = {
  pagination: {} as PaginatedResponse<Votacao>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchVotacoes = createAsyncThunk<PaginatedResponse<Votacao>, PaginationParams>(
  'votacoes/fetchAll',
  async (params) => {
    const response = await VotacoesService.getAll(params);
    return response.data;
  }
);

export const fetchVotacao = createAsyncThunk<Votacao, string>(
  'votacoes/fetchOne',
  async (id: string) => {
    const response = await VotacoesService.getById(id);
    return response.data;
  }
);

export const createVotacao = createAsyncThunk<Votacao, Omit<Votacao, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'votacoes/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await VotacoesService.create(data);
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

export const updateVotacao = createAsyncThunk<
  Votacao,
  { id: string; data: Partial<Votacao> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'votacoes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await VotacoesService.update(id, data);
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

export const deleteVotacao = createAsyncThunk<string, string>(
  'votacoes/delete',
  async (id: string) => {
    await VotacoesService.delete(id);
    return id;
  }
);

// Slice
const votacoesSlice = createSlice({
  name: 'votacoes',
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
      .addCase(fetchVotacoes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVotacoes.fulfilled, (state, action: PayloadAction<PaginatedResponse<Votacao>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchVotacoes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar votacoes';
      })

      .addCase(fetchVotacao.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVotacao.fulfilled, (state, action: PayloadAction<Votacao>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createVotacao.fulfilled, (state, action: PayloadAction<Votacao>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateVotacao.fulfilled, (state, action: PayloadAction<Votacao>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteVotacao.fulfilled, (state, action: PayloadAction<string>) => {
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

export default votacoesSlice.reducer;