import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import CooperadosService from '@/services/cooperadosService';
import { Cooperado } from '@/types/cooperado';

interface CooperadoState {
  list: Cooperado[];
  current: Cooperado | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
}

interface ApiError {
  response?: {
    data: {
      message: string;
      errors?: Record<string, string[]>;
    };
  };
  message: string;
}

type RejectValue = {
  error: SerializedError;
  payload?: { 
    message?: string; 
    errors?: Record<string, string[]>
  };
}

const initialState: CooperadoState = {
  list: [],
  current: null,
  status: 'idle',
  error: null,
  fieldErrors: null,
};

// Thunks
export const fetchCooperados = createAsyncThunk<Cooperado[]>(
  'cooperados/fetchAll',
  async () => {
    const response = await CooperadosService.getAll();
    return response.data;
  }
);

export const fetchCooperado = createAsyncThunk<Cooperado, string>(
  'cooperados/fetchOne',
  async (id: string) => {
    const response = await CooperadosService.getById(id);
    return response.data;
  }
);

export const createCooperado = createAsyncThunk<Cooperado, Omit<Cooperado, 'id'>, { rejectValue: { message: string; errors?: Record<string, string[]> } }>(
  'cooperados/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await CooperadosService.create(data);
      return response.data;
    } catch (error: unknown) {
      const err = error as ApiError;

      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: err.message });
    }
  }
);

export const updateCooperado = createAsyncThunk<
  Cooperado,
  { id: string; data: Partial<Cooperado> },
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'cooperados/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await CooperadosService.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const err = error as ApiError;

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

export const deleteCooperado = createAsyncThunk<string, string>(
  'cooperados/delete',
  async (id: string) => {
    await CooperadosService.delete(id);
    return id;
  }
);

// Slice
const cooperadosSlice = createSlice({
  name: 'cooperados',
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
      .addCase(fetchCooperados.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCooperados.fulfilled, (state, action: PayloadAction<Cooperado[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchCooperados.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao buscar cooperados';
      })

      .addCase(fetchCooperado.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCooperado.fulfilled, (state, action: PayloadAction<Cooperado>) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(createCooperado.fulfilled, (state, action: PayloadAction<Cooperado>) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(updateCooperado.fulfilled, (state, action: PayloadAction<Cooperado>) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })

      .addCase(deleteCooperado.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
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

export default cooperadosSlice.reducer;