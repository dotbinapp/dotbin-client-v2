import type { SessionState } from './session.slice'

interface SessionRootState {
  session: SessionState
}

export const selectSessionStatus = (state: SessionRootState) => state.session.status
export const selectSessionUser = (state: SessionRootState) => state.session.user
export const selectSessionPermissions = (state: SessionRootState) => state.session.user?.permissions ?? []
