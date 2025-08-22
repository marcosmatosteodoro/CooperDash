import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import EnderecosService from '@/services/enderecosService';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type { Endereco } from '@/types/app/endereco';
import type { RejectValue, SliceError, SliceState } from '@/types/app/slice';

const initialState: SliceState<Endereco> = {
  pagination: {} as PaginatedResponse<Endereco>,
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchEnderecos = createAsyncThunk<PaginatedResponse<Endereco>, PaginationParams>(
  'enderecos/fetchAll',
  async (params) => {
    const response = await EnderecosService.getAll(params);
    return response.data;
  }
);

export const fetchEndereco = createAsyncThunk<Endereco, string>(
  'enderecos/fetchOne',
  async (id: string) => {
    const response = await EnderecosService.getById(id);
    return response.data;
  }
);

export const createEndereco = createAsyncThunk<Endereco, Omit<Endereco, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'enderecos/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await EnderecosService.create(data);
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

export const updateEndereco = createAsyncThunk<
  Endereco,
  { id: string; data: Partial<Endereco> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'enderecos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await EnderecosService.update(id, data);
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

export const deleteEndereco = createAsyncThunk<string, string>(
  'enderecos/delete',
  async (id: string) => {
    await EnderecosService.delete(id);
    return id;
  }
);

// Slice
const enderecosSlice = createSlice({
  name: 'enderecos',
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
      .addCase(fetchEnderecos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEnderecos.fulfilled, (state, action: PayloadAction<PaginatedResponse<Endereco>>) => {
        state.pagination = action.payload;
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchEnderecos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar enderecos';
      })

      .addCase(fetchEndereco.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEndereco.fulfilled, (state, action: PayloadAction<Endereco>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createEndereco.fulfilled, (state, action: PayloadAction<Endereco>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateEndereco.fulfilled, (state, action: PayloadAction<Endereco>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.pagination.data = state.pagination.data.map(c => c.id === action.payload.id ? action.payload : c);
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteEndereco.fulfilled, (state, action: PayloadAction<string>) => {
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

export default enderecosSlice.reducer;