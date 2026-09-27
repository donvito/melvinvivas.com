import { useState } from 'react'
import { videos, YOUTUBE_CHANNEL } from '../data/videos'
import { profile } from '../data/profile'

export function VideosApp() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const current = videos[index]

  const select = (i: number, autoplay = true) => {
    setIndex(i)
    setPlaying(autoplay)
  }

  return (
    <>
      <div className="xp-menubar">
        <span>File</span>
        <span>View</span>
        <span>Play</span>
        <span>Tools</span>
        <span>Help</span>
      </div>
      <div className="wmp">
        <div className="wmp-main">
          <div className="wmp-screen">
            {playing ? (
              <iframe
                key={current.id}
                src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button className="wmp-placeholder" onClick={() => setPlaying(true)} style={{ background: 'none', border: 0 }}>
                <img
                  src={`https://i.ytimg.com/vi/${current.id}/hqdefault.jpg`}
                  alt=""
                  style={{ maxWidth: '100%', maxHeight: 220, display: 'block', margin: '0 auto 10px', opacity: 0.85 }}
                />
                <h3>{current.title}</h3>
                <div>Press ▶ to play</div>
              </button>
            )}
          </div>
          <div className="wmp-playlist">
            <h4>Now Playing · {videos.length} items</h4>
            {videos.map((v, i) => (
              <button key={v.id} className={'wmp-track' + (i === index ? ' active' : '')} onClick={() => select(i)}>
                {i + 1}. {v.title}
                {v.date && <small>{new Date(v.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</small>}
              </button>
            ))}
          </div>
        </div>
        <div className="wmp-controls">
          <button className="wmp-ctl" aria-label="Previous" onClick={() => select((index - 1 + videos.length) % videos.length, playing)}>
            ⏮
          </button>
          <button className="wmp-ctl play" aria-label={playing ? 'Stop' : 'Play'} onClick={() => setPlaying((p) => !p)}>
            {playing ? '■' : '▶'}
          </button>
          <button className="wmp-ctl" aria-label="Next" onClick={() => select((index + 1) % videos.length, playing)}>
            ⏭
          </button>
          <div className="seek">
            <span style={{ width: `${((index + 1) / videos.length) * 100}%` }} />
          </div>
          <div className="wmp-links">
            <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href={profile.links.twitch} target="_blank" rel="noopener noreferrer">
              Twitch
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
