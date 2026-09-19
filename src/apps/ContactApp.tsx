import { useState } from 'react'
import { profile } from '../data/profile'

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'X / Twitter', href: profile.links.x },
  { label: 'GitHub', href: profile.links.github },
  { label: 'YouTube', href: profile.links.youtube },
  { label: 'Twitch', href: profile.links.twitch },
  { label: 'Instagram', href: profile.links.instagram },
]

export function ContactApp() {
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('Hello Melvin')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const send = () => {
    const text = `${body}\n\n-- ${from || 'anonymous'}`
    if (profile.email) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
      setStatus('Opening your mail client...')
      return
    }
    navigator.clipboard?.writeText(`${subject}\n\n${text}`).catch(() => undefined)
    setStatus('Message copied to clipboard. Paste it into a LinkedIn or X DM below.')
  }

  return (
    <>
      <div className="xp-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Insert</span>
        <span>Format</span>
        <span>Tools</span>
        <span>Message</span>
        <span>Help</span>
      </div>
      <div className="xp-toolbar">
        <button className="xp-toolbtn active" onClick={send}>
          ✉ Send
        </button>
        <button className="xp-toolbtn" disabled>
          Cut
        </button>
        <button className="xp-toolbtn" disabled>
          Copy
        </button>
        <button className="xp-toolbtn" disabled>
          Paste
        </button>
        <button className="xp-toolbtn" disabled>
          Attach
        </button>
      </div>
      <div className="mail-form">
        <div className="mail-fields">
          <label>
            <span>To:</span>
          </label>
          <input readOnly value={`Melvin Vivas${profile.email ? ` <${profile.email}>` : ''}`} />
          <label>
            <span>From:</span>
          </label>
          <input placeholder="Your name or email" value={from} onChange={(e) => setFrom(e.target.value)} />
          <label htmlFor="subject">Subject:</label>
          <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <textarea
          className="mail-body"
          placeholder="Hi Melvin, I'd like to talk about..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="mail-footer">
          {status ? <b>{status}</b> : <span>Prefer a DM? Find me here:</span>}
          <div className="socials">
            {socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
