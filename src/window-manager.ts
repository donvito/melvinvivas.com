export const appIds = [
  "welcome",
  "about",
  "projects",
  "writing",
  "contact",
  "notepad",
  "recycle",
  "settings",
] as const;
export type AppId = (typeof appIds)[number];
export type AppWindow = {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
};
export type DesktopState = { windows: AppWindow[]; active: AppId | null };
export type Viewport = { width: number; height: number };
export type WindowAction =
  | { type: "open"; id: AppId; viewport: Viewport }
  | { type: "focus"; id: AppId }
  | { type: "close"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "maximize"; id: AppId }
  | { type: "taskbar"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number; viewport: Viewport }
  | {
      type: "resize";
      id: AppId;
      width: number;
      height: number;
      viewport: Viewport;
    }
  | { type: "viewport"; viewport: Viewport }
  | { type: "show-desktop" };

export function isAppId(value: string): value is AppId {
  return appIds.some((id) => id === value);
}

export function fitWindow(win: AppWindow, viewport: Viewport): AppWindow {
  const width = Math.min(win.width, viewport.width - 12);
  const height = Math.min(win.height, viewport.height - 54);
  return {
    ...win,
    width,
    height,
    x: Math.max(6, Math.min(win.x, viewport.width - width - 6)),
    y: Math.max(6, Math.min(win.y, viewport.height - height - 48)),
  };
}

function focus(state: DesktopState, id: AppId): DesktopState {
  const win = state.windows.find((item) => item.id === id);
  if (!win) return state;
  return {
    windows: [
      ...state.windows.filter((item) => item.id !== id),
      { ...win, minimized: false },
    ],
    active: id,
  };
}

function topVisible(windows: AppWindow[]): AppId | null {
  return windows.findLast((item) => !item.minimized)?.id ?? null;
}

export function windowReducer(
  state: DesktopState,
  action: WindowAction,
): DesktopState {
  if (action.type === "show-desktop") {
    return {
      windows: state.windows.map((win) => ({ ...win, minimized: true })),
      active: null,
    };
  }
  if (action.type === "viewport") {
    return {
      ...state,
      windows: state.windows.map((win) => fitWindow(win, action.viewport)),
    };
  }
  if (action.type === "open") {
    if (state.windows.some((win) => win.id === action.id))
      return focus(state, action.id);
    const width =
      action.id === "welcome" ? 840 : action.id === "notepad" ? 570 : 740;
    const height =
      action.id === "welcome" ? 670 : action.id === "recycle" ? 410 : 610;
    const offset = (state.windows.length % 5) * 26;
    const win = fitWindow(
      {
        id: action.id,
        x: Math.max(150, (action.viewport.width - width) / 2) + offset,
        y:
          Math.max(38, (action.viewport.height - height - 42) / 2 - 20) +
          offset,
        width,
        height,
        minimized: false,
        maximized: false,
      },
      action.viewport,
    );
    return { windows: [...state.windows, win], active: action.id };
  }
  if (action.type === "focus") return focus(state, action.id);
  if (action.type === "close") {
    const windows = state.windows.filter((win) => win.id !== action.id);
    return {
      windows,
      active: state.active === action.id ? topVisible(windows) : state.active,
    };
  }
  if (action.type === "taskbar") {
    const win = state.windows.find((item) => item.id === action.id);
    if (win?.minimized || state.active !== action.id)
      return focus(state, action.id);
    return windowReducer(state, { type: "minimize", id: action.id });
  }
  if (action.type === "minimize") {
    const windows = state.windows.map((win) =>
      win.id === action.id ? { ...win, minimized: true } : win,
    );
    return {
      windows,
      active: state.active === action.id ? topVisible(windows) : state.active,
    };
  }
  if (action.type === "maximize") {
    const focused = focus(state, action.id);
    return {
      ...focused,
      windows: focused.windows.map((win) =>
        win.id === action.id ? { ...win, maximized: !win.maximized } : win,
      ),
    };
  }
  return {
    ...state,
    windows: state.windows.map((win) => {
      if (win.id !== action.id) return win;
      if (action.type === "move")
        return fitWindow({ ...win, x: action.x, y: action.y }, action.viewport);
      return fitWindow(
        {
          ...win,
          width: Math.max(
            350,
            Math.min(action.width, action.viewport.width - win.x - 6),
          ),
          height: Math.max(
            280,
            Math.min(action.height, action.viewport.height - win.y - 48),
          ),
        },
        action.viewport,
      );
    }),
  };
}
