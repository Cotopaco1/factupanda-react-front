import { create } from 'zustand'
import type { TenantSettings } from '@/types/tenantSettings'

type TenantSettingsStoreState = {
  settings: TenantSettings | null
  setSettings: (settings: TenantSettings | null) => void
  clearSettings: () => void
}

export const useTenantSettingsStore = create<TenantSettingsStoreState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  clearSettings: () => set({ settings: null }),
}))
