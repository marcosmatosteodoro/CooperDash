import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AssembleiasService from '@/services/assembleiasService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { Assembleia } from '@/types/app/assembleia';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<Assembleia> = {
  pagination: {} as PaginatedResponse<Assembleia>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchAssembleias = createAsyncThunk<PaginatedResponse<Assembleia>, PaginationParams>(
  'assembleias/fetchAll',
  async (params) => {
    const response = await AssembleiasService.getAll(params);
    return response.data;
  }
);

export const fetchAssembleia = createAsyncThunk<Assembleia, string>(
  'assembleias/fetchOne',
  async (id: string) => {
    const response = await AssembleiasService.getById(id);
    return response.data;
  }
);

export const createAssembleia = createAsyncThunk<Assembleia, Omit<Assembleia, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'assembleias/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssembleiasService.create(data);
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

export const updateAssembleia = createAsyncThunk<
  Assembleia,
  { id: string; data: Partial<Assembleia> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'assembleias/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await AssembleiasService.update(id, data);
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

export const deleteAssembleia = createAsyncThunk<string, string>(
  'assembleias/delete',
  async (id: string) => {
    await AssembleiasService.delete(id);
    return id;
  }
);

// Slice
const assembleiasSlice = createSlice({
  name: 'assembleias',
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
      .addCase(fetchAssembleias.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssembleias.fulfilled, (state, action: PayloadAction<PaginatedResponse<Assembleia>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchAssembleias.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar assembleias';
      })

      .addCase(fetchAssembleia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssembleia.fulfilled, (state, action: PayloadAction<Assembleia>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createAssembleia.fulfilled, (state, action: PayloadAction<Assembleia>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateAssembleia.fulfilled, (state, action: PayloadAction<Assembleia>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteAssembleia.fulfilled, (state, action: PayloadAction<string>) => {
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

export default assembleiasSlice.reducer;