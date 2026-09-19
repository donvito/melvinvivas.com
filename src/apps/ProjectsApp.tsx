import { useState } from 'react'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { FolderIcon } from '../icons'
import { useWM } from '../wm'

function GitIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="4" width="24" height="24" rx="4" fill="#24292f" />
      <path
        d="M16 8a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.3c0 .2.1.5.5.4A8 8 0 0 0 16 8z"
        fill="#fff"
      />
    </svg>
  )
}

export function ProjectsApp() {
  const wm = useWM()
  const [selected, setSelected] = useState<string | null>(null)
  const sel = projects.find((p) => p.id === selected)

  return (
    <>
      <div className="xp-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>
      <div className="xp-toolbar">
        <button className="xp-toolbtn" disabled>
          ← Back
        </button>
        <button className="xp-toolbtn" disabled>
          → Forward
        </button>
        <div className="xp-address">
          <span>Address</span>
          <input readOnly value="C:\Documents and Settings\Melvin\My Projects" />
        </div>
      </div>
      <div className="explorer">
        <aside className="explorer-side">
          <div className="explorer-panel">
            <h4>File and Folder Tasks</h4>
            <ul>
              <li>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  View all repositories on GitHub
                </a>
              </li>
              <li>
                <button onClick={() => wm.open('blog')}>Read the blog</button>
              </li>
              <li>
                <button onClick={() => wm.open('contact')}>Get in touch</button>
              </li>
            </ul>
          </div>
          <div className="explorer-panel">
            <h4>Other Places</h4>
            <ul>
              <li>
                <button onClick={() => wm.open('about')}>About Me</button>
              </li>
              <li>
                <button onClick={() => wm.open('resume')}>Resume</button>
              </li>
              <li>
                <button onClick={() => wm.open('videos')}>Videos</button>
              </li>
            </ul>
          </div>
          <div className="explorer-panel">
            <h4>Details</h4>
            <p>
              <b>My Projects</b>
              <br />
              File Folder
              <br />
              {projects.length} items
              <br />
              Mostly open source. Click a project to see details, double-click to open it on GitHub.
            </p>
          </div>
        </aside>
        <div className="explorer-main">
          <div className="explorer-group-title">Open Source &amp; Side Projects ({projects.length})</div>
          <div className="explorer-grid">
            {projects.map((p) => (
              <button
                key={p.id}
                className={'explorer-item' + (selected === p.id ? ' selected' : '')}
                onClick={() => setSelected(p.id)}
                onDoubleClick={() => window.open(p.githubUrl ?? p.websiteUrl, '_blank', 'noopener')}
              >
                {p.githubUrl ? <GitIcon /> : <FolderIcon size={32} />}
                <span>
                  <b>{p.title}</b>
                  <span className="explorer-item-desc">{p.description}</span>
                  <span className="tags">
                    {p.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {sel && (
            <div className="explorer-detail">
              <h3>{sel.title}</h3>
              <p>{sel.description}</p>
              <div className="links">
                {sel.githubUrl && (
                  <a className="xp-btn" href={sel.githubUrl} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                )}
                {sel.websiteUrl && (
                  <a className="xp-btn" href={sel.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="xp-statusbar">
        <span>{sel ? `${sel.title} selected` : `${projects.length} objects`}</span>
        <span>My Computer</span>
      </div>
    </>
  )
}
