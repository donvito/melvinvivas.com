import { createContext, useContext } from 'react'
import type { AppId } from './apps/registry'

export interface WindowState {
  id: AppId
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
  opening: boolean
}

export interface WMState {
  windows: WindowState[]
  active: AppId | null
  nextZ: number
}

export type WMAction =
  | { type: 'open'; id: AppId; size: { w: number; h: number } }
  | { type: 'close'; id: AppId }
  | { type: 'focus'; id: AppId }
  | { type: 'minimize'; id: AppId }
  | { type: 'toggleMaximize'; id: AppId }
  | { type: 'move'; id: AppId; x: number; y: number }
  | { type: 'resize'; id: AppId; w: number; h: number }
  | { type: 'opened'; id: AppId }
  | { type: 'blur' }

export const initialWM: WMState = { windows: [], active: null, nextZ: 10 }

const TASKBAR = 30

function placement(index: number, w: number, h: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR
  const cw = Math.min(w, vw - 16)
  const ch = Math.min(h, vh - 16)
  const offset = (index % 6) * 28
  const x = Math.max(8, Math.round((vw - cw) / 2 + offset - 60))
  const y = Math.max(8, Math.round((vh - ch) / 2 + offset - 40))
  return { x, y, w: cw, h: ch }
}

export function wmReducer(state: WMState, action: WMAction): WMState {
  switch (action.type) {
    case 'open': {
      const existing = state.windows.find((w) => w.id === action.id)
      if (existing) {
        return {
          ...state,
          active: action.id,
          nextZ: state.nextZ + 1,
          windows: state.windows.map((w) =>
            w.id === action.id ? { ...w, minimized: false, z: state.nextZ } : w,
          ),
        }
      }
      const small = window.innerWidth < 640
      const win: WindowState = {
        id: action.id,
        ...placement(state.windows.length, action.size.w, action.size.h),
        z: state.nextZ,
        minimized: false,
        maximized: small,
        opening: true,
      }
      return { ...state, windows: [...state.windows, win], active: action.id, nextZ: state.nextZ + 1 }
    }
    case 'opened':
      return { ...state, windows: state.windows.map((w) => (w.id === action.id ? { ...w, opening: false } : w)) }
    case 'close': {
      const windows = state.windows.filter((w) => w.id !== action.id)
      const top = windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]
      return { ...state, windows, active: top?.id ?? null }
    }
    case 'focus':
      if (state.active === action.id && !state.windows.find((w) => w.id === action.id)?.minimized) return state
      return {
        ...state,
        active: action.id,
        nextZ: state.nextZ + 1,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, z: state.nextZ, minimized: false } : w)),
      }
    case 'minimize': {
      const windows = state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w))
      const top = windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]
      return { ...state, windows, active: top?.id ?? null }
    }
    case 'toggleMaximize':
      return {
        ...state,
        active: action.id,
        nextZ: state.nextZ + 1,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, maximized: !w.maximized, z: state.nextZ } : w)),
      }
    case 'move':
      return { ...state, windows: state.windows.map((w) => (w.id === action.id ? { ...w, x: action.x, y: action.y } : w)) }
    case 'resize':
      return { ...state, windows: state.windows.map((w) => (w.id === action.id ? { ...w, w: action.w, h: action.h } : w)) }
    case 'blur':
      return { ...state, active: null }
  }
}

export interface WMContextValue {
  state: WMState
  open: (id: AppId) => void
  close: (id: AppId) => void
  focus: (id: AppId) => void
  minimize: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  move: (id: AppId, x: number, y: number) => void
  resize: (id: AppId, w: number, h: number) => void
  opened: (id: AppId) => void
}

export const WMContext = createContext<WMContextValue | null>(null)

export function useWM() {
  const ctx = useContext(WMContext)
  if (!ctx) throw new Error('WMContext missing')
  return ctx
}
