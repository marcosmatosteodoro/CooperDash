import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ParcelasEmprestimosService from '@/services/parcelasEmprestimosService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { ParcelaEmprestimo } from '@/types/app/parcelaEmprestimo';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<ParcelaEmprestimo> = {
  pagination: {} as PaginatedResponse<ParcelaEmprestimo>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchParcelasEmprestimos = createAsyncThunk<PaginatedResponse<ParcelaEmprestimo>, PaginationParams>(
  'parcelasEmprestimos/fetchAll',
  async (params) => {
    const response = await ParcelasEmprestimosService.getAll(params);
    return response.data;
  }
);

export const fetchParcelaEmprestimo = createAsyncThunk<ParcelaEmprestimo, string>(
  'parcelasEmprestimos/fetchOne',
  async (id: string) => {
    const response = await ParcelasEmprestimosService.getById(id);
    return response.data;
  }
);

export const createParcelaEmprestimo = createAsyncThunk<ParcelaEmprestimo, Omit<ParcelaEmprestimo, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'parcelasEmprestimos/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await ParcelasEmprestimosService.create(data);
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

export const updateParcelaEmprestimo = createAsyncThunk<
  ParcelaEmprestimo,
  { id: string; data: Partial<ParcelaEmprestimo> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'parcelasEmprestimos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ParcelasEmprestimosService.update(id, data);
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

export const deleteParcelaEmprestimo = createAsyncThunk<string, string>(
  'parcelasEmprestimos/delete',
  async (id: string) => {
    await ParcelasEmprestimosService.delete(id);
    return id;
  }
);

// Slice
const parcelasEmprestimosSlice = createSlice({
  name: 'parcelasEmprestimos',
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
      .addCase(fetchParcelasEmprestimos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParcelasEmprestimos.fulfilled, (state, action: PayloadAction<PaginatedResponse<ParcelaEmprestimo>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchParcelasEmprestimos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar parcelasEmprestimos';
      })

      .addCase(fetchParcelaEmprestimo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParcelaEmprestimo.fulfilled, (state, action: PayloadAction<ParcelaEmprestimo>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createParcelaEmprestimo.fulfilled, (state, action: PayloadAction<ParcelaEmprestimo>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateParcelaEmprestimo.fulfilled, (state, action: PayloadAction<ParcelaEmprestimo>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteParcelaEmprestimo.fulfilled, (state, action: PayloadAction<string>) => {
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

export default parcelasEmprestimosSlice.reducer;