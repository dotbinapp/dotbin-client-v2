import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserSession } from '../model/session.types'

type SessionStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface SessionState extends UserSession {
  error: string | null
  status: SessionStatus
}

const initialState: SessionState = {
  center: null,
  doctor: null,
  error: null,
  status: 'idle',
  user: null,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    clearSession: () => initialState,
    markSessionLoading(state) {
      state.error = null
      state.status = 'loading'
    },
    setSession(state, action: PayloadAction<UserSession>) {
      state.center = action.payload.center
      state.doctor = action.payload.doctor
      state.error = null
      state.status = 'ready'
      state.user = action.payload.user
    },
    setSessionError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.status = 'error'
    },
  },
})

export const { clearSession, markSessionLoading, setSession, setSessionError } = sessionSlice.actions
export const sessionReducer = sessionSlice.reducer
