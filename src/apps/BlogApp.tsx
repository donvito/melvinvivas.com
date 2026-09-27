import { useMemo, useState } from 'react'
import { BLOG_BASE_URL, posts, postUrl } from '../data/posts'
import { profile } from '../data/profile'

export function BlogApp() {
  const [tag, setTag] = useState<string | null>(null)
  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
  }, [])
  const visible = tag ? posts.filter((p) => p.tags.includes(tag)) : posts

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
          →
        </button>
        <button className="xp-toolbtn" onClick={() => setTag(null)}>
          ⟳ Refresh
        </button>
        <a className="xp-toolbtn" href={BLOG_BASE_URL} target="_blank" rel="noopener noreferrer">
          ⌂ Home
        </a>
        <div className="xp-address">
          <span>Address</span>
          <input readOnly value={`${BLOG_BASE_URL}/`} />
          <a className="xp-btn" href={BLOG_BASE_URL} target="_blank" rel="noopener noreferrer" style={{ minWidth: 0, padding: '2px 8px' }}>
            Go
          </a>
        </div>
      </div>
      <div className="ie-page">
        <div className="ie-hero">
          <h1>Melvin Dave Vivas Tech Blog</h1>
          <p>Programming guides on Go, Docker, Kubernetes, microservices and AI. Most posts include source code on GitHub.</p>
        </div>
        <div className="ie-filters">
          <button className={'ie-filter' + (tag === null ? ' active' : '')} onClick={() => setTag(null)}>
            All ({posts.length})
          </button>
          {tags.map((t) => (
            <button key={t} className={'ie-filter' + (tag === t ? ' active' : '')} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
        <ul className="ie-posts">
          {visible.map((p) => (
            <li key={p.slug}>
              <a className="ie-post" href={postUrl(p)} target="_blank" rel="noopener noreferrer">
                <b>{p.title}</b>
                <small>
                  {new Date(p.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} · {p.tags.join(', ')}
                </small>
                <p>{p.description}</p>
              </a>
            </li>
          ))}
        </ul>
        <div className="ie-note">
          Newer writing and AI news lives on{' '}
          <a href={profile.links.donvitocodes} target="_blank" rel="noopener noreferrer">
            donvitocodes.com
          </a>
          .
        </div>
      </div>
      <div className="xp-statusbar">
        <span>{visible.length} articles</span>
        <span>Internet</span>
      </div>
    </>
  )
}
