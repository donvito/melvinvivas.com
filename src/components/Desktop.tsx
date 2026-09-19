import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { apps, isAppId, type AppId } from '../apps/registry'
import { icons } from '../iconMap'
import { initialWM, WMContext, wmReducer, type WMContextValue } from '../wm'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { StartMenu } from './StartMenu'

interface Props {
  onLogOff: () => void
}

function hashApp(): AppId | null {
  const h = window.location.hash.replace(/^#\/?/, '')
  return isAppId(h) ? h : null
}

export function Desktop({ onLogOff }: Props) {
  const [state, dispatch] = useReducer(wmReducer, null, () => {
    const id = hashApp()
    return id ? wmReducer(initialWM, { type: 'open', id, size: apps.find((a) => a.id === id)!.size }) : initialWM
  })
  const [startOpen, setStartOpen] = useState(false)
  const [selected, setSelected] = useState<AppId | null>(null)

  const open = useCallback((id: AppId) => {
    const app = apps.find((a) => a.id === id)!
    dispatch({ type: 'open', id, size: app.size })
    setStartOpen(false)
    if (window.location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`)
  }, [])

  const wm = useMemo<WMContextValue>(
    () => ({
      state,
      open,
      close: (id) => {
        dispatch({ type: 'close', id })
        if (window.location.hash === `#${id}`) history.replaceState(null, '', window.location.pathname)
      },
      focus: (id) => {
        dispatch({ type: 'focus', id })
        history.replaceState(null, '', `#${id}`)
      },
      minimize: (id) => dispatch({ type: 'minimize', id }),
      toggleMaximize: (id) => dispatch({ type: 'toggleMaximize', id }),
      move: (id, x, y) => dispatch({ type: 'move', id, x, y }),
      resize: (id, w, h) => dispatch({ type: 'resize', id, w, h }),
      opened: (id) => dispatch({ type: 'opened', id }),
    }),
    [state, open],
  )

  // Deep links: melvinvivas.com/#projects opens the Projects window.
  useEffect(() => {
    const onHash = () => {
      const id = hashApp()
      if (id) open(id)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const desktopApps = apps.filter((a) => a.desktop)

  return (
    <WMContext.Provider value={wm}>
      <div
        className="xp-desktop"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelected(null)
            setStartOpen(false)
            dispatch({ type: 'blur' })
          }
        }}
      >
        <div className="xp-icons" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          {desktopApps.map((a) => {
            const Icon = icons[a.icon]
            return (
              <button
                key={a.id}
                className={'xp-icon' + (selected === a.id ? ' selected' : '')}
                onClick={() => setSelected(a.id)}
                onDoubleClick={() => open(a.id)}
                onKeyDown={(e) => e.key === 'Enter' && open(a.id)}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  open(a.id)
                }}
                aria-label={`Open ${a.title}`}
              >
                <Icon size={40} />
                <span>{a.title}</span>
              </button>
            )
          })}
        </div>

        {state.windows.map((w) => (
          <Window key={w.id} win={w} app={apps.find((a) => a.id === w.id)!} active={state.active === w.id} />
        ))}

        {startOpen && (
          <>
            <div className="xp-sm-backdrop" onPointerDown={() => setStartOpen(false)} />
            <StartMenu onOpen={open} onClose={() => setStartOpen(false)} onLogOff={onLogOff} />
          </>
        )}

        <Taskbar startOpen={startOpen} onToggleStart={() => setStartOpen((s) => !s)} />
      </div>
    </WMContext.Provider>
  )
}
