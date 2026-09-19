import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { apps } from "./data";
import { isAppId, windowReducer } from "./window-manager";
import type { AppId, DesktopState } from "./window-manager";
import { Icon, Flag } from "./components/Icon";
import { WindowFrame } from "./components/Window";
import {
  About,
  Contact,
  Notepad,
  Projects,
  RecycleBin,
  Settings,
  Welcome,
  Writing,
} from "./components/Apps";
import type { Wallpaper } from "./components/Apps";

const desktopApps: AppId[] = [
  "about",
  "projects",
  "writing",
  "contact",
  "notepad",
  "recycle",
];
const defaultNote =
  "Hello, internet friend.\n\nA little space to think, sketch an idea, or leave yourself a reminder.\n\nMake something that makes you smile.\n\n— Melvin\n\nP.S. These notes stay in your browser. Only you can see them.";

function readStored(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function initialDesktop(): DesktopState {
  const hash = window.location.hash.slice(1);
  return windowReducer(
    { windows: [], active: null },
    {
      type: "open",
      id: isAppId(hash) ? hash : "welcome",
      viewport: { width: window.innerWidth, height: window.innerHeight },
    },
  );
}

export function Desktop() {
  const [state, dispatch] = useReducer(
    windowReducer,
    undefined,
    initialDesktop,
  );
  const [startOpen, setStartOpen] = useState(false);
  const [clockOpen, setClockOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [sound, setSound] = useState(false);
  const [note, setNote] = useState(() =>
    readStored("melvin-notepad", defaultNote),
  );
  const [noteSaved, setNoteSaved] = useState(true);
  const [wallpaper, setWallpaperState] = useState<Wallpaper>(() => {
    const stored = readStored("melvin-wallpaper", "meadow");
    return stored === "azure" || stored === "midnight" ? stored : "meadow";
  });
  const [context, setContext] = useState<{ x: number; y: number } | null>(null);
  const [notice, setNotice] = useState("");
  const startRef = useRef<HTMLElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const audio = useRef<AudioContext | null>(null);

  const open = useCallback(
    (id: AppId) => {
      dispatch({
        type: "open",
        id,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
      setStartOpen(false);
      setContext(null);
      setClockOpen(false);
      window.history.replaceState(null, "", `#${id}`);
      if (sound) {
        try {
          audio.current ??= new AudioContext();
          const ctx = audio.current;
          void ctx.resume();
          const oscillator = ctx.createOscillator();
          const gain = ctx.createGain();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(660, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            880,
            ctx.currentTime + 0.08,
          );
          gain.gain.setValueAtTime(0.035, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
          oscillator.connect(gain);
          gain.connect(ctx.destination);
          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.2);
        } catch {
          setSound(false);
        }
      }
    },
    [sound],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    const resize = () =>
      dispatch({
        type: "viewport",
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
    const hash = () => {
      const id = window.location.hash.slice(1);
      if (isAppId(id)) open(id);
    };
    window.addEventListener("resize", resize);
    window.addEventListener("hashchange", hash);
    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("hashchange", hash);
    };
  }, [open]);

  useEffect(() => {
    if (startOpen) startRef.current?.querySelector("button")?.focus();
  }, [startOpen]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const setWallpaper = (value: Wallpaper) => {
    setWallpaperState(value);
    try {
      localStorage.setItem("melvin-wallpaper", value);
    } catch {
      setNotice(
        "Background changed for this visit. Browser storage is unavailable.",
      );
    }
  };
  const saveNote = (value: string) => {
    setNote(value);
    try {
      localStorage.setItem("melvin-notepad", value);
      setNoteSaved(true);
    } catch {
      setNoteSaved(false);
    }
  };

  return (
    <div
      className={`desktop wallpaper-${wallpaper}`}
      onPointerDown={(event) => {
        if (
          event.target instanceof Element &&
          !event.target.closest(
            ".start-menu, .start-button, .context-menu, .clock-panel, .clock-button",
          )
        ) {
          setStartOpen(false);
          setClockOpen(false);
          setContext(null);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (startOpen) startButton.current?.focus();
          setStartOpen(false);
          setContext(null);
          setClockOpen(false);
        }
      }}
      onContextMenu={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest(".window, .taskbar, .start-menu")
        )
          return;
        event.preventDefault();
        setContext({
          x: Math.min(event.clientX, window.innerWidth - 205),
          y: Math.min(event.clientY, window.innerHeight - 200),
        });
        setStartOpen(false);
      }}
    >
      <a className="skip-link" href="#welcome" onClick={() => open("welcome")}>
        Open welcome window
      </a>
      <nav className="desktop-shortcuts" aria-label="Desktop apps">
        {desktopApps.map((id) => (
          <button
            key={id}
            className="desktop-shortcut"
            onClick={() => open(id)}
            title={apps[id].description}
          >
            <span className="shortcut-image">
              <Icon name={apps[id].icon} size={45} />
              {id !== "recycle" && <i aria-hidden="true">↗</i>}
            </span>
            <span>{apps[id].short}</span>
          </button>
        ))}
      </nav>
      <div className="desktop-signature">
        <span>melvinvivas.com</span>
        <small>MY PERSONAL DESKTOP</small>
      </div>
      <button className="desktop-note" onClick={() => open("notepad")}>
        <span className="note-pin" />
        <small>note to self:</small>
        <span>
          Stay curious.
          <br />
          Keep building.
        </span>
        <i>the rest will follow.</i>
      </button>
      <div className="desktop-caption">
        <span>A familiar place. A few new ideas.</span>
        <small>Built with curiosity, powered by nostalgia.</small>
      </div>
      {state.windows.map((win, index) => (
        <WindowFrame
          key={win.id}
          win={win}
          active={state.active === win.id}
          index={index}
          dispatch={dispatch}
          open={open}
        >
          {win.id === "welcome" && <Welcome open={open} />}
          {win.id === "about" && <About open={open} />}
          {win.id === "projects" && <Projects open={open} />}
          {win.id === "writing" && <Writing open={open} />}
          {win.id === "contact" && <Contact />}
          {win.id === "notepad" && (
            <Notepad text={note} onChange={saveNote} saved={noteSaved} />
          )}
          {win.id === "recycle" && <RecycleBin />}
          {win.id === "settings" && (
            <Settings wallpaper={wallpaper} setWallpaper={setWallpaper} />
          )}
        </WindowFrame>
      ))}
      {context && (
        <div
          className="context-menu menu-popup"
          style={{ left: context.x, top: context.y }}
        >
          <button onClick={() => open("welcome")}>
            <strong>Open Welcome</strong>
          </button>
          <button
            onClick={() => {
              dispatch({ type: "show-desktop" });
              setContext(null);
            }}
          >
            Show the desktop
          </button>
          <button onClick={() => open("notepad")}>New text document</button>
          <hr />
          <button onClick={() => open("settings")}>Properties</button>
        </div>
      )}
      {startOpen && (
        <nav
          ref={startRef}
          id="desktop-start"
          className="start-menu"
          aria-label="Start menu"
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
              return;
            const buttons = Array.from(
              event.currentTarget.querySelectorAll("button"),
            );
            const index = buttons.findIndex(
              (button) => button === document.activeElement,
            );
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? buttons.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      buttons.length) %
                    buttons.length;
            event.preventDefault();
            buttons[next]?.focus();
          }}
        >
          <header>
            <img src="/melvin.jpg" alt="" width="46" height="46" />
            <div>
              <strong>Melvin Vivas</strong>
              <span>Welcome to my world.</span>
            </div>
          </header>
          <div className="start-columns">
            <div className="start-main">
              {(
                [
                  "welcome",
                  "about",
                  "projects",
                  "writing",
                  "contact",
                  "notepad",
                ] as const
              ).map((id) => (
                <button key={id} onClick={() => open(id)}>
                  <Icon name={apps[id].icon} size={35} />
                  <span>
                    <strong>{apps[id].short}</strong>
                    <small>{apps[id].description}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="start-side">
              <button onClick={() => open("projects")}>
                <Icon name="folder" size={27} />
                My Projects
              </button>
              <button onClick={() => open("writing")}>
                <Icon name="writing" size={27} />
                My Documents
              </button>
              <hr />
              <button onClick={() => open("settings")}>
                <Icon name="settings" size={27} />
                Control Panel
              </button>
              <button onClick={() => open("recycle")}>
                <Icon name="recycle" size={27} />
                Recycle Bin
              </button>
              <hr />
              <button onClick={() => open("welcome")}>
                <Icon name="computer" size={27} />
                Help & welcome
              </button>
            </div>
          </div>
          <footer>
            <span>Personal edition</span>
            <button
              onClick={() => {
                dispatch({ type: "show-desktop" });
                setStartOpen(false);
              }}
            >
              <Icon name="computer" size={23} />
              Show desktop
            </button>
          </footer>
        </nav>
      )}
      {clockOpen && (
        <section className="clock-panel">
          <span>
            {clock.toLocaleDateString(undefined, { weekday: "long" })}
          </span>
          <strong>{clock.getDate()}</strong>
          <p>
            {clock.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </p>
          <hr />
          <small>Your local time · A good day to make something.</small>
        </section>
      )}
      {notice && (
        <div role="status" className="desktop-notice">
          {notice}
        </div>
      )}
      <footer className="taskbar">
        <button
          ref={startButton}
          className={`start-button ${startOpen ? "pressed" : ""}`}
          aria-expanded={startOpen}
          aria-controls="desktop-start"
          onClick={() => {
            setStartOpen(!startOpen);
            setClockOpen(false);
          }}
        >
          <Flag />
          <span>start</span>
        </button>
        <div className="quick-launch">
          <button
            title="Show desktop"
            aria-label="Show desktop"
            onClick={() => dispatch({ type: "show-desktop" })}
          >
            <Icon name="computer" size={23} />
          </button>
          <button
            title="Welcome"
            aria-label="Open Welcome"
            onClick={() => open("welcome")}
          >
            <Icon name="web" size={23} />
          </button>
        </div>
        <div className="taskbar-apps">
          {state.windows.map((win) => (
            <button
              key={win.id}
              className={
                state.active === win.id && !win.minimized ? "selected" : ""
              }
              aria-pressed={state.active === win.id && !win.minimized}
              onClick={() => dispatch({ type: "taskbar", id: win.id })}
              title={apps[win.id].title}
            >
              <Icon name={apps[win.id].icon} size={20} />
              <span>{apps[win.id].short}</span>
            </button>
          ))}
        </div>
        <div className="system-tray">
          <button
            className="sound-button"
            title={sound ? "Mute desktop sounds" : "Enable desktop sounds"}
            aria-label={sound ? "Mute desktop sounds" : "Enable desktop sounds"}
            aria-pressed={sound}
            onClick={() => {
              setSound(!sound);
              setNotice(
                sound
                  ? "Desktop sounds off"
                  : "Desktop sounds on — open an app to hear them.",
              );
            }}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
              <path d="M3 9h4l6-5v16l-6-5H3z" fill="#f4edc7" stroke="#406a98" />
              <path
                d={sound ? "M16 7q7 5 0 10M16 10q3 2 0 4" : "m17 9 5 6m0-6-5 6"}
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <span className="connection" title="You’re on Melvin’s desktop">
            <i />
            <i />
          </span>
          <button
            className="clock-button"
            onClick={() => {
              setClockOpen(!clockOpen);
              setStartOpen(false);
            }}
            aria-expanded={clockOpen}
            title={clock.toLocaleDateString()}
          >
            {clock.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </button>
        </div>
      </footer>
    </div>
  );
}
