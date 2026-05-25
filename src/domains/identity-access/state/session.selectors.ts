import type { RootState } from '@src/app/store'

export const selectSessionStatus = (state: RootState) => state.session.status
export const selectSessionUser = (state: RootState) => state.session.user
export const selectSessionPermissions = (state: RootState) => state.session.user?.permissions ?? []
