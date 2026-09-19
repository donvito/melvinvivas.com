import { useState } from "react";
import type { ReactNode } from "react";
import { apps, articles, projects, socialLinks } from "../data";
import type { AppId } from "../window-manager";
import { Icon } from "./Icon";

type OpenApp = (id: AppId) => void;
export type Wallpaper = "meadow" | "azure" | "midnight";

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="external-mark" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function ExplorerSidebar({ open, current }: { open: OpenApp; current: AppId }) {
  return (
    <aside className="explorer-sidebar">
      <div className="side-group">
        <h3>
          My little corner <span>⌃</span>
        </h3>
        <div>
          {(["about", "projects", "writing", "contact"] as const).map((id) => (
            <button
              className={current === id ? "selected" : ""}
              key={id}
              onClick={() => open(id)}
            >
              <Icon name={apps[id].icon} size={19} />
              {apps[id].short}
            </button>
          ))}
        </div>
      </div>
      <div className="side-group">
        <h3>
          Other places <span>⌃</span>
        </h3>
        <div>
          <ExternalLink href="https://github.com/donvito">
            <Icon name="code" size={18} /> My GitHub
          </ExternalLink>
          <ExternalLink href="https://www.donvitocodes.com">
            <Icon name="web" size={18} /> DonvitoCodes
          </ExternalLink>
        </div>
      </div>
      <div className="side-group details-group">
        <h3>
          Details <span>⌃</span>
        </h3>
        <div>
          <strong>Melvin Vivas</strong>
          <p>
            Software engineer
            <br />
            AI practitioner
            <br />
            Based in Singapore
          </p>
          <span className="small-status">
            <i /> Always curious
          </span>
        </div>
      </div>
      <div className="sidebar-flower" aria-hidden="true">
        ✳
      </div>
    </aside>
  );
}

export function Welcome({ open }: { open: OpenApp }) {
  return (
    <div className="explorer-layout">
      <ExplorerSidebar open={open} current="welcome" />
      <main className="welcome-page">
        <div className="welcome-topline">
          <span>HELLO, WORLD. IT’S NICE TO SEE YOU.</span>
          <span className="tiny-label">personal edition</span>
        </div>
        <div className="intro">
          <div>
            <p className="intro-eyebrow">You’ve found the desktop of</p>
            <h1>
              Melvin Vivas<span>.</span>
            </h1>
            <p className="intro-roles">
              Software engineer. AI practitioner.
              <br />
              Curious human.
            </p>
          </div>
          <div className="profile-frame">
            <img
              src="/melvin.jpg"
              alt="Melvin Vivas"
              width="108"
              height="108"
            />
            <span>that’s me!</span>
          </div>
        </div>
        <p className="welcome-description">
          I build things, explore what’s next, and share what I learn along the
          way. Welcome to my little corner of the internet.
        </p>
        <div className="section-rule">
          <span>Make yourself at home</span>
          <i />
        </div>
        <div className="welcome-apps">
          {(["about", "projects", "writing"] as const).map((id) => (
            <button key={id} onClick={() => open(id)}>
              <Icon name={apps[id].icon} size={39} />
              <strong>{id === "about" ? "Meet Melvin" : apps[id].short}</strong>
              <span>
                {id === "about"
                  ? "A little about me"
                  : id === "projects"
                    ? "Made with curiosity"
                    : "Ideas & discoveries"}
              </span>
              <b aria-hidden="true">→</b>
            </button>
          ))}
        </div>
        <div className="welcome-bottom">
          <span className="small-status">
            <i /> Building, learning, sharing.
          </span>
          <button onClick={() => open("contact")}>
            Let’s connect <span>↗</span>
          </button>
        </div>
        <div className="welcome-hint">
          <Icon name="computer" size={18} /> Just like the old days. Open an
          app. Drag a window. Stay a while.
        </div>
      </main>
    </div>
  );
}

export function About({ open }: { open: OpenApp }) {
  const [tab, setTab] = useState("General");
  return (
    <div className="properties-page">
      <div className="property-tabs">
        {["General", "My journey", "Interests"].map((name) => (
          <button
            key={name}
            className={tab === name ? "selected" : ""}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="property-content">
        <div className="about-identity">
          <img src="/melvin.jpg" alt="Melvin Vivas" width="110" height="110" />
          <div>
            <p className="eyebrow">HUMAN, PERSONAL EDITION</p>
            <h2>Melvin Vivas</h2>
            <p>
              Also known as <strong>DonvitoCodes</strong>
            </p>
            <span className="small-status">
              <i /> Singapore
            </span>
          </div>
        </div>
        {tab === "General" && (
          <>
            <h3>A builder at heart.</h3>
            <p>
              I’m a software engineer and AI practitioner based in Singapore. I
              like turning new technology into useful things — and helping other
              people do the same.
            </p>
            <p>
              These days, I’m building AI tools, exploring agents, and sharing
              practical lessons through writing, training, and conversations.
            </p>
            <dl className="system-specs">
              <div>
                <dt>Operating system</dt>
                <dd>Curiosity, with regular updates</dd>
              </div>
              <div>
                <dt>Core processes</dt>
                <dd>Build · Learn · Share · Repeat</dd>
              </div>
              <div>
                <dt>Currently running</dt>
                <dd>AIBackends, Coworker & a few ideas</dd>
              </div>
            </dl>
          </>
        )}
        {tab === "My journey" && (
          <div className="timeline">
            <div>
              <span>1999</span>
              <h3>Started with software</h3>
              <p>
                Began my career in the Philippines, building software and
                discovering how much there was to learn.
              </p>
            </div>
            <div>
              <span>2005 →</span>
              <h3>New places, new challenges</h3>
              <p>
                Worked in Singapore and the Philippines, across startups, my own
                business, and larger teams.
              </p>
            </div>
            <div>
              <span>Today</span>
              <h3>Exploring what AI makes possible</h3>
              <p>
                Building tools, contributing to open source, and helping people
                apply AI to real work.
              </p>
            </div>
          </div>
        )}
        {tab === "Interests" && (
          <>
            <h3>Things that keep the tabs open</h3>
            <div className="interest-grid">
              {[
                [
                  "code",
                  "Open-source software",
                  "Building in the open and learning together.",
                ],
                [
                  "computer",
                  "AI that’s actually useful",
                  "Tools and agents that help people do things.",
                ],
                [
                  "writing",
                  "Sharing the process",
                  "Technical writing, live coding, and teaching.",
                ],
                [
                  "web",
                  "The good old internet",
                  "Personal websites with a bit of personality.",
                ],
              ].map(([icon, title, text]) => (
                <div key={title}>
                  <Icon
                    name={icon as "code" | "computer" | "writing" | "web"}
                    size={34}
                  />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="dialog-actions">
        <button className="xp-button" onClick={() => open("projects")}>
          My Projects
        </button>
        <button className="xp-button primary" onClick={() => open("contact")}>
          Say hello
        </button>
      </div>
    </div>
  );
}

export function Projects({ open }: { open: OpenApp }) {
  const [filter, setFilter] = useState("All projects");
  const [query, setQuery] = useState("");
  const filtered = projects.filter(
    (project) =>
      (filter === "All projects" || project.category === filter) &&
      `${project.name} ${project.description} ${project.tech}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="explorer-layout">
      <ExplorerSidebar open={open} current="projects" />
      <main className="content-page">
        <p className="eyebrow">A FEW THINGS I’VE PUT INTO THE WORLD</p>
        <h2>Made with curiosity.</h2>
        <p className="page-subtitle">
          Useful tools. Open experiments. Work in progress.
        </p>
        <label className="search-field">
          <span>Find a project</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this folder…"
            type="search"
          />
        </label>
        <div className="filter-tabs">
          {["All projects", "AI & agents", "Developer tools", "Community"].map(
            (item) => (
              <button
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
                key={item}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <div className="project-list">
          {filtered.map((project) => (
            <article key={project.name}>
              <Icon name={project.icon} size={40} />
              <div>
                <div className="project-title">
                  <h3>
                    <ExternalLink href={project.url}>
                      {project.name}
                    </ExternalLink>
                  </h3>
                  <span>{project.type}</span>
                </div>
                <p>{project.description}</p>
                <small>{project.tech}</small>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="empty-message">
              No projects found. Try another search or folder.
            </p>
          )}
        </div>
        <p className="folder-count" aria-live="polite">
          {filtered.length} object{filtered.length === 1 ? "" : "s"}
        </p>
      </main>
    </div>
  );
}

export function Writing({ open }: { open: OpenApp }) {
  return (
    <div className="explorer-layout">
      <ExplorerSidebar open={open} current="writing" />
      <main className="content-page">
        <p className="eyebrow">FROM MY DIGITAL NOTEBOOK</p>
        <h2>Learning out loud.</h2>
        <p className="page-subtitle">
          Notes on AI, software, and figuring things out.
        </p>
        <div className="writing-list">
          {articles.map((article) => (
            <article key={article.url}>
              <div className="article-meta">
                <span>{article.tag}</span>
                <time>{article.date}</time>
              </div>
              <h3>
                <ExternalLink href={article.url}>{article.title}</ExternalLink>
              </h3>
              <p>{article.description}</p>
              <ExternalLink href={article.url} className="read-story">
                Read the story
              </ExternalLink>
            </article>
          ))}
        </div>
        <ExternalLink
          href="https://blog.donvitocodes.com"
          className="xp-button all-writing"
        >
          Open the full blog
        </ExternalLink>
      </main>
    </div>
  );
}

export function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-heading">
        <Icon name="contact" size={65} />
        <p className="eyebrow">GOOD CONVERSATIONS START WITH HELLO</p>
        <h2>Let’s connect.</h2>
        <p>
          Building something interesting? Exploring AI?
          <br />
          Or just want to say hi? My inbox is open.
        </p>
      </div>
      <div className="contact-links">
        {socialLinks.map((link) => (
          <ExternalLink href={link.url} key={link.name}>
            <Icon name={link.icon} size={32} />
            <span>
              <strong>{link.name}</strong>
              <small>{link.handle}</small>
            </span>
          </ExternalLink>
        ))}
      </div>
      <p className="contact-footnote">
        From your corner of the internet to mine.
      </p>
    </main>
  );
}

export function Notepad({
  text,
  onChange,
  saved,
}: {
  text: string;
  onChange: (value: string) => void;
  saved: boolean;
}) {
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-desktop-notes.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="notepad-app">
      <div className="notepad-toolbar">
        <span>
          {saved
            ? "Saved in this browser"
            : "Browser storage unavailable — download to save"}
        </span>
        <button className="xp-button" onClick={download}>
          Save as .txt
        </button>
      </div>
      <textarea
        aria-label="Your personal notes"
        spellCheck={false}
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="notepad-status">
        Ln {text.split("\n").length}{" "}
        <span>{text.length} characters · UTF-8</span>
      </div>
    </div>
  );
}

export function RecycleBin() {
  return (
    <main className="recycle-page">
      <Icon name="recycle" size={80} />
      <h2>Nothing to see here.</h2>
      <p>
        I’ve already emptied the imposter syndrome,
        <br />
        abandoned side projects, and old node_modules.
      </p>
      <p className="recycle-aside">Okay, maybe not all the side projects.</p>
      <span className="tiny-label">0 items · a fresh start</span>
    </main>
  );
}

export function Settings({
  wallpaper,
  setWallpaper,
}: {
  wallpaper: Wallpaper;
  setWallpaper: (value: Wallpaper) => void;
}) {
  return (
    <main className="settings-page">
      <div className={`monitor-preview wallpaper-${wallpaper}`}>
        <div className="mini-window">
          <div />
          Hello, world.
        </div>
        <span />
      </div>
      <h2>Make yourself at home.</h2>
      <p>Choose a background for your little escape.</p>
      <div className="wallpaper-options">
        {(["meadow", "azure", "midnight"] as const).map((item) => (
          <button
            key={item}
            className={wallpaper === item ? "selected" : ""}
            onClick={() => setWallpaper(item)}
            aria-pressed={wallpaper === item}
          >
            <span className={`wallpaper-${item}`} />
            <strong>
              {item === "meadow"
                ? "A little bliss"
                : item === "azure"
                  ? "Classic blue"
                  : "After hours"}
            </strong>
          </button>
        ))}
      </div>
      <div className="settings-tip">
        <strong>A few desktop shortcuts</strong>
        <p>
          Click an icon to open an app. Drag a title bar to move a window.
          Double-click it to maximize. Use the bottom-right corner to resize.
        </p>
        <p>
          <kbd>Alt</kbd> + <kbd>M</kbd> to minimize · <kbd>Alt</kbd> +{" "}
          <kbd>W</kbd> to close.
        </p>
        <p>
          On a small screen, windows fit automatically. Use Start to switch
          apps.
        </p>
      </div>
    </main>
  );
}
