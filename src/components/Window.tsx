import { useEffect, useRef, useState } from "react";
import type { Dispatch, PointerEvent, ReactNode } from "react";
import { apps } from "../data";
import type { AppId, AppWindow, WindowAction } from "../window-manager";
import { Icon, Flag } from "./Icon";

export function WindowFrame({
  win,
  active,
  index,
  dispatch,
  open,
  children,
}: {
  win: AppWindow;
  active: boolean;
  index: number;
  dispatch: Dispatch<WindowAction>;
  open: (id: AppId) => void;
  children: ReactNode;
}) {
  const frame = useRef<HTMLElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    resize: boolean;
  } | null>(null);
  const [menu, setMenu] = useState<"file" | "view" | null>(null);
  const app = apps[win.id];
  const explorer = ["welcome", "projects", "writing", "contact"].includes(
    win.id,
  );

  useEffect(() => {
    if (active && !win.minimized) frame.current?.focus({ preventScroll: true });
  }, [active, win.minimized]);

  const begin = (event: PointerEvent<HTMLElement>, resize = false) => {
    if (
      win.maximized ||
      event.button !== 0 ||
      (event.target instanceof Element && event.target.closest("button"))
    )
      return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      startX: resize ? win.width : win.x,
      startY: resize ? win.height : win.y,
      resize,
    };
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const origin = drag.current;
    if (!origin) return;
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const x = origin.startX + event.clientX - origin.x;
    const y = origin.startY + event.clientY - origin.y;
    dispatch(
      origin.resize
        ? { type: "resize", id: win.id, width: x, height: y, viewport }
        : { type: "move", id: win.id, x, y, viewport },
    );
  };

  return (
    <section
      ref={frame}
      role="dialog"
      aria-label={app.title}
      tabIndex={-1}
      hidden={win.minimized}
      className={`window ${active ? "active" : "inactive"} ${win.maximized ? "maximized" : ""}`}
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: index + 10,
      }}
      onPointerDownCapture={() => {
        if (!active) dispatch({ type: "focus", id: win.id });
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setMenu(null);
        if (event.altKey && event.key.toLowerCase() === "w") {
          event.preventDefault();
          dispatch({ type: "close", id: win.id });
        }
        if (event.altKey && event.key.toLowerCase() === "m") {
          event.preventDefault();
          dispatch({ type: "minimize", id: win.id });
        }
      }}
    >
      <header
        className="titlebar"
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
        onDoubleClick={(event) => {
          if (
            !(event.target instanceof Element && event.target.closest("button"))
          )
            dispatch({ type: "maximize", id: win.id });
        }}
      >
        <Icon name={app.icon} size={19} />
        <span className="window-title">{app.title}</span>
        <div className="window-controls">
          <button
            className="minimize"
            aria-label={`Minimize ${app.short}`}
            title="Minimize"
            onClick={() => dispatch({ type: "minimize", id: win.id })}
          >
            <span />
          </button>
          <button
            className={win.maximized ? "restore" : "maximize"}
            aria-label={`${win.maximized ? "Restore" : "Maximize"} ${app.short}`}
            title={win.maximized ? "Restore down" : "Maximize"}
            onClick={() => dispatch({ type: "maximize", id: win.id })}
          >
            <span />
          </button>
          <button
            className="close"
            aria-label={`Close ${app.short}`}
            title="Close"
            onClick={() => dispatch({ type: "close", id: win.id })}
          >
            <span />
          </button>
        </div>
      </header>
      <div
        className="menubar"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null);
        }}
      >
        <div className="menu-anchor">
          <button
            aria-expanded={menu === "file"}
            onClick={() => setMenu(menu === "file" ? null : "file")}
          >
            File
          </button>
          {menu === "file" && (
            <div className="menu-popup">
              <button
                onClick={() => {
                  open("welcome");
                  setMenu(null);
                }}
              >
                Open Welcome
              </button>
              <button
                onClick={() => dispatch({ type: "minimize", id: win.id })}
              >
                Minimize <span>Alt+M</span>
              </button>
              <hr />
              <button onClick={() => dispatch({ type: "close", id: win.id })}>
                Close <span>Alt+W</span>
              </button>
            </div>
          )}
        </div>
        <div className="menu-anchor">
          <button
            aria-expanded={menu === "view"}
            onClick={() => setMenu(menu === "view" ? null : "view")}
          >
            View
          </button>
          {menu === "view" && (
            <div className="menu-popup">
              <button
                onClick={() => {
                  dispatch({ type: "maximize", id: win.id });
                  setMenu(null);
                }}
              >
                {win.maximized ? "Restore window" : "Maximize window"}
              </button>
              <button
                onClick={() => {
                  open("settings");
                  setMenu(null);
                }}
              >
                Display properties
              </button>
            </div>
          )}
        </div>
        <button onClick={() => open("projects")}>Favorites</button>
        <button onClick={() => open("welcome")}>Help</button>
        <span className="menubar-flag">
          <Flag />
        </span>
      </div>
      {explorer && (
        <>
          <nav
            className="explorer-toolbar"
            aria-label={`${app.short} navigation`}
          >
            <button onClick={() => open("welcome")} title="Back to Welcome">
              <Icon name="arrow" size={27} />
              <span>Back</span>
              <small>▾</small>
            </button>
            <span className="toolbar-separator" />
            <button onClick={() => open("projects")}>
              <Icon name="folder" size={27} />
              <span>Folders</span>
            </button>
            <button onClick={() => open("writing")}>
              <Icon name="writing" size={25} />
              <span>My Writing</span>
            </button>
            <span className="toolbar-note">
              a personal space on the internet
            </span>
          </nav>
          <div className="addressbar">
            <span>Address</span>
            <div>
              <Icon name={app.icon} size={16} />
              <span>
                C:\Melvin\{win.id === "welcome" ? "Welcome" : app.short}
              </span>
              <small>▾</small>
            </div>
            <button onClick={() => open("welcome")} title="Go to Welcome">
              <span className="go-arrow">➜</span> Go
            </button>
          </div>
        </>
      )}
      <div className={`window-body ${explorer ? "explorer-body" : ""}`}>
        {children}
      </div>
      <footer className="statusbar">
        <span>
          {win.id === "welcome" ? "Welcome, curious human." : app.description}
        </span>
        <span>
          <Icon name="computer" size={14} />{" "}
          {win.id === "notepad" ? "Local document" : "My Computer"}
        </span>
      </footer>
      {!win.maximized && (
        <div
          className="resize-grip"
          onPointerDown={(event) => begin(event, true)}
          onPointerMove={move}
          onPointerUp={() => {
            drag.current = null;
          }}
          onLostPointerCapture={() => {
            drag.current = null;
          }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}
