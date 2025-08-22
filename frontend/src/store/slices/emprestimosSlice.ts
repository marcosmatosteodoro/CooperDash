import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import EmprestimosService from '@/services/emprestimosService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { Emprestimo } from '@/types/app/emprestimo';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<Emprestimo> = {
  pagination: {} as PaginatedResponse<Emprestimo>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchEmprestimos = createAsyncThunk<PaginatedResponse<Emprestimo>, PaginationParams>(
  'emprestimos/fetchAll',
  async (params) => {
    const response = await EmprestimosService.getAll(params);
    return response.data;
  }
);

export const fetchEmprestimo = createAsyncThunk<Emprestimo, string>(
  'emprestimos/fetchOne',
  async (id: string) => {
    const response = await EmprestimosService.getById(id);
    return response.data;
  }
);

export const createEmprestimo = createAsyncThunk<Emprestimo, Omit<Emprestimo, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'emprestimos/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await EmprestimosService.create(data);
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

export const updateEmprestimo = createAsyncThunk<
  Emprestimo,
  { id: string; data: Partial<Emprestimo> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'emprestimos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await EmprestimosService.update(id, data);
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

export const deleteEmprestimo = createAsyncThunk<string, string>(
  'emprestimos/delete',
  async (id: string) => {
    await EmprestimosService.delete(id);
    return id;
  }
);

// Slice
const emprestimosSlice = createSlice({
  name: 'emprestimos',
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
      .addCase(fetchEmprestimos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmprestimos.fulfilled, (state, action: PayloadAction<PaginatedResponse<Emprestimo>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchEmprestimos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar emprestimos';
      })

      .addCase(fetchEmprestimo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmprestimo.fulfilled, (state, action: PayloadAction<Emprestimo>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createEmprestimo.fulfilled, (state, action: PayloadAction<Emprestimo>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateEmprestimo.fulfilled, (state, action: PayloadAction<Emprestimo>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteEmprestimo.fulfilled, (state, action: PayloadAction<string>) => {
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

export default emprestimosSlice.reducer;