import { apps, type AppDef, type AppId } from '../apps/registry'
import { UserAvatar } from '../icons'
import { icons } from '../iconMap'
import { profile } from '../data/profile'

interface Props {
  onOpen: (id: AppId) => void
  onClose: () => void
  onLogOff: () => void
}

const external = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'X / Twitter', href: profile.links.x },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'YouTube', href: profile.links.youtube },
  { label: 'DonvitoCodes', href: profile.links.donvitocodes },
]

export function StartMenu({ onOpen, onClose, onLogOff }: Props) {
  const isGame = (a: AppDef) => a.game === true
  const left = apps.filter((a) => a.startMenu && !isGame(a))
  const games = apps.filter((a) => a.startMenu && isGame(a))
  return (
    <div className="xp-startmenu" role="menu" aria-labelledby="start-button">
      <div className="xp-sm-header">
        <UserAvatar size={44} />
        <span>{profile.name}</span>
      </div>
      <div className="xp-sm-body">
        <div className="xp-sm-left">
          {left.map((a) => {
            const Icon = icons[a.icon]
            return (
              <button key={a.id} className="xp-sm-item" role="menuitem" onClick={() => onOpen(a.id)}>
                <Icon size={30} />
                <span>
                  <b>{a.title}</b>
                  <small>{describe(a.id)}</small>
                </span>
              </button>
            )
          })}
          <div className="xp-sm-sep" />
          <button className="xp-sm-item all" role="menuitem" onClick={() => onOpen('projects')}>
            <b>All Programs</b>
            <span className="xp-sm-arrow">▸</span>
          </button>
        </div>
        <div className="xp-sm-right">
          <div className="xp-sm-right-title">Find me online</div>
          {external.map((l) => (
            <a key={l.href} className="xp-sm-link" href={l.href} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={onClose}>
              {l.label}
            </a>
          ))}
          <div className="xp-sm-sep" />
          <div className="xp-sm-right-title">Games</div>
          {games.map((a) => {
            const Icon = icons[a.icon]
            return (
              <button key={a.id} className="xp-sm-link" role="menuitem" onClick={() => onOpen(a.id)}>
                <Icon size={16} />
                {a.title}
              </button>
            )
          })}
          <div className="xp-sm-sep" />
          <a className="xp-sm-link" href={profile.links.coffee} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={onClose}>
            Buy me a coffee
          </a>
          <button className="xp-sm-link" role="menuitem" onClick={() => onOpen('recycle')}>
            Recycle Bin
          </button>
        </div>
      </div>
      <div className="xp-sm-footer">
        <button onClick={onLogOff}>
          <span className="xp-sm-fbtn logoff" />
          Log Off
        </button>
        <button onClick={onLogOff}>
          <span className="xp-sm-fbtn shutdown" />
          Turn Off Computer
        </button>
      </div>
    </div>
  )
}

function describe(id: AppId) {
  switch (id) {
    case 'about':
      return 'Who I am and what I do'
    case 'projects':
      return 'Open source & side projects'
    case 'blog':
      return 'Programming guides since 2016'
    case 'videos':
      return 'YouTube & Twitch'
    case 'resume':
      return 'Experience & skills'
    case 'contact':
      return 'Get in touch'
    case 'minesweeper':
    case 'flappy':
    case 'solitaire':
      return 'Take a break'
    case 'calculator':
      return 'Crunch some numbers'
    case 'recycle':
      return ''
  }
}
