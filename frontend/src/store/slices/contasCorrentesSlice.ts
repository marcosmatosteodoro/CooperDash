import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ContasCorrentesService from '@/services/contasCorrentesService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { ContaCorrente } from '@/types/app/contaCorrente';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<ContaCorrente> = {
  pagination: {} as PaginatedResponse<ContaCorrente>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchContasCorrentes = createAsyncThunk<PaginatedResponse<ContaCorrente>, PaginationParams>(
  'contasCorrentes/fetchAll',
  async (params) => {
    const response = await ContasCorrentesService.getAll(params);
    return response.data;
  }
);

export const fetchContaCorrente = createAsyncThunk<ContaCorrente, string>(
  'contasCorrentes/fetchOne',
  async (id: string) => {
    const response = await ContasCorrentesService.getById(id);
    return response.data;
  }
);

export const createContaCorrente = createAsyncThunk<ContaCorrente, Omit<ContaCorrente, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'contasCorrentes/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await ContasCorrentesService.create(data);
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

export const updateContaCorrente = createAsyncThunk<
  ContaCorrente,
  { id: string; data: Partial<ContaCorrente> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'contasCorrentes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ContasCorrentesService.update(id, data);
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

export const deleteContaCorrente = createAsyncThunk<string, string>(
  'contasCorrentes/delete',
  async (id: string) => {
    await ContasCorrentesService.delete(id);
    return id;
  }
);

// Slice
const contasCorrentesSlice = createSlice({
  name: 'contasCorrentes',
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
      .addCase(fetchContasCorrentes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContasCorrentes.fulfilled, (state, action: PayloadAction<PaginatedResponse<ContaCorrente>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchContasCorrentes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar contasCorrentes';
      })

      .addCase(fetchContaCorrente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContaCorrente.fulfilled, (state, action: PayloadAction<ContaCorrente>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createContaCorrente.fulfilled, (state, action: PayloadAction<ContaCorrente>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateContaCorrente.fulfilled, (state, action: PayloadAction<ContaCorrente>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteContaCorrente.fulfilled, (state, action: PayloadAction<string>) => {
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

export default contasCorrentesSlice.reducer;