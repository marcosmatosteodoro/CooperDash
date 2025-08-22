import { SerializedError } from "@reduxjs/toolkit";
import { PaginatedResponse } from "../api";

export interface SliceState<T> {
  pagination: PaginatedResponse<T>;
  list: T[];
  current: T | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
}

export interface SliceError {
  response?: {
    data: {
      message: string;
      errors?: Record<string, string[]>;
    };
  };
  message: string;
}

export type RejectValue = {
  error: SerializedError;
  payload?: { 
    message?: string; 
    errors?: Record<string, string[]>
  };
}