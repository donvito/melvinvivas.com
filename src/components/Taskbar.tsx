import { useEffect, useState } from 'react'
import { apps } from '../apps/registry'
import { StartFlag } from '../icons'
import { icons } from '../iconMap'
import { useWM } from '../wm'

interface Props {
  startOpen: boolean
  onToggleStart: () => void
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(t)
  }, [])
  const label = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return (
    <div className="xp-clock" title={now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}>
      {label}
    </div>
  )
}

export function Taskbar({ startOpen, onToggleStart }: Props) {
  const { state, focus, minimize } = useWM()

  return (
    <div className="xp-taskbar">
      <button
        className={'xp-start' + (startOpen ? ' pressed' : '')}
        onClick={onToggleStart}
        aria-haspopup="menu"
        aria-expanded={startOpen}
        id="start-button"
      >
        <StartFlag />
        <span>start</span>
      </button>
      <div className="xp-tasks">
        {state.windows.map((w) => {
          const app = apps.find((a) => a.id === w.id)!
          const Icon = icons[app.icon]
          const isActive = state.active === w.id && !w.minimized
          return (
            <button
              key={w.id}
              className={'xp-task' + (isActive ? ' active' : '')}
              onClick={() => (isActive ? minimize(w.id) : focus(w.id))}
            >
              <Icon size={16} />
              <span>{app.title}</span>
            </button>
          )
        })}
      </div>
      <div className="xp-tray">
        <span className="xp-tray-icon" title="Network: connected">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="1" y="4" width="6" height="5" fill="#2f6fd6" stroke="#0a3c8f" />
            <rect x="9" y="7" width="6" height="5" fill="#2f6fd6" stroke="#0a3c8f" />
            <path d="M4 9v3h4M12 7V4H8" stroke="#0a3c8f" fill="none" />
          </svg>
        </span>
        <span className="xp-tray-icon" title="Volume">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5a5a5a" strokeWidth="1.2">
            <path d="M2 6h3l4-3v10l-4-3H2z" fill="#9aa5b8" />
            <path d="M11 5c2 1.5 2 4.5 0 6M13 3c3 2.5 3 7.5 0 10" />
          </svg>
        </span>
        <Clock />
      </div>
    </div>
  )
}
