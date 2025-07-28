import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CooperadosService from '../../services/cooperadosService';

export const fetchCooperados = createAsyncThunk(
  'cooperados/fetchAll',
  async () => {
    const response = await CooperadosService.getAll();
    return response.data;
  }
);

export const fetchCooperado = createAsyncThunk(
  'cooperados/fetchOne',
  async (id) => {
    const response = await CooperadosService.getById(id);
    return response.data;
  }
);

export const createCooperado = createAsyncThunk(
  'cooperados/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await CooperadosService.create(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

export const updateCooperado = createAsyncThunk(
  'cooperados/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await CooperadosService.update(id, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        const payload = error.response.data || {};
        return rejectWithValue({
          message: payload.message || 'Erro na atualização',
          errors: payload.errors || null
        });
      }
      return rejectWithValue({
        message: error.message || 'Erro desconhecido',
        errors: null
      });
    }
  }
);

export const deleteCooperado = createAsyncThunk(
  'cooperados/delete',
  async (id) => {
    await CooperadosService.delete(id);
    return id;
  }
);

const cooperadosSlice = createSlice({
  name: 'cooperados',
  initialState: {
    list: [],
    current: null,
    status: 'idle',
    error: null,
    fieldErrors: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCooperados.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCooperados.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchCooperados.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch One
      .addCase(fetchCooperado.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCooperado.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })
      
      // Create
      .addCase(createCooperado.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.error = null;
        state.fieldErrors = null;
      })
      
      
      // Update
      .addCase(updateCooperado.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.current = action.payload;
        state.error = null;
        state.fieldErrors = null;
      })
      
      // Delete
      .addCase(deleteCooperado.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
        state.current = null;
        state.error = null;
        state.fieldErrors = null;
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload?.message || action.error.message || 'Erro desconhecido';
          
          if (action.payload?.errors) {
            state.fieldErrors = action.payload.errors;
          } else {
            state.fieldErrors = null;
          }
        }
      );
  }
});

export default cooperadosSlice.reducer;