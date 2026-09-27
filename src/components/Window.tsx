import { useEffect, useRef, type PointerEvent as RPointerEvent } from 'react'
import type { AppDef } from '../apps/registry'
import type { WindowState } from '../wm'
import { useWM } from '../wm'
import { icons } from '../iconMap'

interface Props {
  win: WindowState
  app: AppDef
  active: boolean
}

export function Window({ win, app, active }: Props) {
  const wm = useWM()
  const Icon = icons[app.icon]
  const Content = app.component
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!win.opening) return
    const t = setTimeout(() => wm.opened(win.id), 180)
    return () => clearTimeout(t)
  }, [win.opening, win.id, wm])

  const startDrag = (e: RPointerEvent<HTMLDivElement>) => {
    if (win.maximized || e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const ox = win.x
    const oy = win.y
    const onMove = (ev: PointerEvent) => {
      const nx = Math.min(Math.max(ox + ev.clientX - startX, -win.w + 80), window.innerWidth - 40)
      const ny = Math.min(Math.max(oy + ev.clientY - startY, 0), window.innerHeight - 60)
      wm.move(win.id, nx, ny)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const startResize = (e: RPointerEvent<HTMLDivElement>) => {
    if (win.maximized) return
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const ow = win.w
    const oh = win.h
    const onMove = (ev: PointerEvent) => {
      wm.resize(win.id, Math.max(260, ow + ev.clientX - startX), Math.max(160, oh + ev.clientY - startY))
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const style = win.maximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 30px)', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  return (
    <div
      ref={ref}
      className={[
        'xp-window',
        active ? 'active' : 'inactive',
        win.minimized ? 'minimized' : '',
        win.maximized ? 'maximized' : '',
        win.opening ? 'opening' : '',
      ].join(' ')}
      style={style}
      onPointerDown={() => wm.focus(win.id)}
      role="dialog"
      aria-label={app.title}
    >
      <div className="xp-titlebar" onPointerDown={startDrag} onDoubleClick={() => wm.toggleMaximize(win.id)}>
        <span className="xp-title-icon">
          <Icon size={16} />
        </span>
        <span className="xp-title-text">{app.windowTitle ?? app.title}</span>
        <div className="xp-title-buttons">
          <button className="xp-tb min" aria-label="Minimize" onClick={() => wm.minimize(win.id)}>
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="8" width="7" height="2.5" fill="#fff" /></svg>
          </button>
          <button className="xp-tb max" aria-label={win.maximized ? 'Restore' : 'Maximize'} onClick={() => wm.toggleMaximize(win.id)}>
            {win.maximized ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.4">
                <rect x="3.5" y="1.5" width="7" height="6" />
                <rect x="1.5" y="4.5" width="7" height="6" fill="#0a5cd8" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.5">
                <rect x="1.5" y="1.5" width="9" height="9" />
                <path d="M1.5 3.5h9" strokeWidth="2" />
              </svg>
            )}
          </button>
          <button className="xp-tb close" aria-label="Close" onClick={() => wm.close(win.id)}>
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="#fff" strokeWidth="2"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className={'xp-window-body' + (app.bare ? ' bare' : '')}>
        <Content />
      </div>
      {!win.maximized && <div className="xp-resize" onPointerDown={startResize} />}
    </div>
  )
}
