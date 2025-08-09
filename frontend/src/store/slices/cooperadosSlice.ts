import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CooperadosService from '@/services/cooperadosService';
import { Cooperado } from '@/types/cooperado';

interface CooperadoState {
  list: Cooperado[];
  current: Cooperado | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
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

export const createCooperado = createAsyncThunk<
  Cooperado,
  Partial<Cooperado>,
  { rejectValue: { message: string; errors?: Record<string, string[]> } }
>(
  'cooperados/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await CooperadosService.create(data as Cooperado);
      return response.data;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response?: unknown }).response !== null
      ) {
        const response = (error as { response?: { data?: unknown } }).response;
        if (response && typeof response === 'object' && 'data' in response) {
          return rejectWithValue((response as { data: { message: string; errors?: Record<string, string[]> } }).data);
        }
        return rejectWithValue({ message: 'Erro desconhecido' });
      }
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Erro desconhecido' });
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
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response?: unknown }).response !== null
      ) {
        const response = (error as { response?: { data?: unknown } }).response;
        const payload =
          response && typeof response === 'object' && 'data' in response
            ? (response as { data?: { message?: string; errors?: Record<string, string[]> } }).data || {}
            : {};
        return rejectWithValue({
          message: payload.message || 'Erro na atualização',
          errors: payload.errors ?? undefined,
        });
      }
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        errors: undefined,
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
        (action) => action.type.endsWith('/rejected'),
        (
          state,
          action: PayloadAction<
            { message: string; errors?: Record<string, string[]> } | undefined
          > & { error?: { message?: string } }
        ) => {
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