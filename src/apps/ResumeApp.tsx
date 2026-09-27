import { Fragment } from 'react'
import { profile, skills, timeline } from '../data/profile'

export function ResumeApp() {
  return (
    <>
      <div className="xp-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Insert</span>
        <span>Format</span>
        <span>Help</span>
      </div>
      <div className="xp-toolbar">
        <button className="xp-toolbtn" onClick={() => window.print()}>
          🖨 Print
        </button>
        <a className="xp-toolbtn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
          in LinkedIn profile
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#555' }}>Georgia · 13</span>
      </div>
      <div className="wordpad-ruler" />
      <div className="wordpad-page-wrap">
        <article className="wordpad-page" id="resume">
          <h1>{profile.name}</h1>
          <div className="sub">
            {profile.title} · {profile.location}
          </div>
          <p>{profile.bio[0]}</p>

          <h2>Experience</h2>
          {timeline.map((t) => (
            <div className="entry" key={t.period + t.org}>
              <div className="entry-head">
                <b>
                  {t.role}, {t.org}
                </b>
                <span>{t.period}</span>
              </div>
              <p>{t.detail}</p>
            </div>
          ))}

          <h2>Skills</h2>
          <div className="skills">
            {skills.map((s) => (
              <Fragment key={s.group}>
                <b>{s.group}</b>
                <span>{s.items.join(', ')}</span>
              </Fragment>
            ))}
          </div>

          <h2>Writing &amp; Speaking</h2>
          <p>
            Author of the melvinvivas.com tech blog since 2016; livestreams coding and developer interviews on Twitch; workshops and
            talks on AI for engineers and business teams.
          </p>

          <h2>Links</h2>
          <p>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
              github.com/donvito
            </a>{' '}
            ·{' '}
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/melvinvivas
            </a>{' '}
            ·{' '}
            <a href={profile.links.donvitocodes} target="_blank" rel="noopener noreferrer">
              donvitocodes.com
            </a>
          </p>
        </article>
      </div>
      <div className="xp-statusbar">
        <span>For Help, press F1</span>
        <span>Page 1</span>
      </div>
    </>
  )
}
