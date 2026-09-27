import { profile, skills } from '../data/profile'
import { useWM } from '../wm'

export function AboutApp() {
  const wm = useWM()
  return (
    <>
      <div className="xp-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>Format</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div className="notepad-text">
        {`${profile.name}\n${'='.repeat(profile.name.length)}\n${profile.title}\n${profile.location}\n\n`}
        {profile.bio.map((p, i) => (
          <span key={i}>
            {p}
            {'\n\n'}
          </span>
        ))}
        {`What I work with\n----------------\n`}
        {skills.map((s) => `${s.group.padEnd(18)} ${s.items.join(', ')}\n`).join('')}
        {`\nAround the desktop\n------------------\n`}
        {'* '}
        <button className="notepad-link" onClick={() => wm.open('projects')}>My Projects</button>
        {' - open source and side projects\n* '}
        <button className="notepad-link" onClick={() => wm.open('blog')}>Blog</button>
        {' - programming guides since 2016\n* '}
        <button className="notepad-link" onClick={() => wm.open('videos')}>Videos</button>
        {' - YouTube and Twitch\n* '}
        <button className="notepad-link" onClick={() => wm.open('resume')}>Resume</button>
        {' - experience and skills\n* '}
        <button className="notepad-link" onClick={() => wm.open('contact')}>Contact</button>
        {' - say hello\n\n'}
        {`Elsewhere\n---------\n`}
        {'GitHub    '}<a href={profile.links.github} target="_blank" rel="noopener noreferrer">{profile.links.github}</a>{'\n'}
        {'X         '}<a href={profile.links.x} target="_blank" rel="noopener noreferrer">{profile.links.x}</a>{'\n'}
        {'LinkedIn  '}<a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">{profile.links.linkedin}</a>{'\n'}
        {'YouTube   '}<a href={profile.links.youtube} target="_blank" rel="noopener noreferrer">{profile.links.youtube}</a>{'\n'}
        {'Business  '}<a href={profile.links.donvitocodes} target="_blank" rel="noopener noreferrer">{profile.links.donvitocodes}</a>{'\n'}
      </div>
      <div className="xp-statusbar">
        <span />
        <span>Ln 1, Col 1</span>
      </div>
    </>
  )
}
