import { useEffect, useState } from 'react'
import { StartFlag, UserAvatar } from '../icons'
import { profile } from '../data/profile'

interface Props {
  onDone: () => void
}

export function BootScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'boot' | 'welcome'>('boot')

  useEffect(() => {
    const t = setTimeout(() => setPhase('welcome'), 2200)
    const skip = () => setPhase('welcome')
    window.addEventListener('keydown', skip)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', skip)
    }
  }, [])

  if (phase === 'boot') {
    return (
      <div className="xp-boot" onClick={() => setPhase('welcome')}>
        <div className="xp-boot-logo">
          <StartFlag size={56} />
          <div>
            <div className="xp-boot-brand">Melvin<span>Vivas</span></div>
            <div className="xp-boot-sub">Personal Edition</div>
          </div>
        </div>
        <div className="xp-boot-bar">
          <div className="xp-boot-bar-inner" />
        </div>
        <div className="xp-boot-footer">Copyright © {new Date().getFullYear()} Melvin Vivas · press any key to skip</div>
      </div>
    )
  }

  return (
    <div className="xp-welcome">
      <div className="xp-welcome-top" />
      <div className="xp-welcome-main">
        <div className="xp-welcome-left">
          <StartFlag size={64} />
          <p>To begin, click your user name</p>
        </div>
        <div className="xp-welcome-divider" />
        <div className="xp-welcome-right">
          <button className="xp-user" onClick={onDone} autoFocus>
            <UserAvatar size={56} />
            <span>
              <b>{profile.name}</b>
              <small>{profile.title}</small>
            </span>
          </button>
        </div>
      </div>
      <div className="xp-welcome-bottom">
        <span>After you log on, you can explore my work by opening the apps on the desktop.</span>
      </div>
    </div>
  )
}
