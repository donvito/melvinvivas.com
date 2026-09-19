# Melvin’s personal desktop

A Windows XP-inspired personal website for [melvinvivas.com](https://melvinvivas.com), built with React, TypeScript, and Vite.

## Development

Use Node.js **22.18+** (Node 24 also works) and npm:

```sh
npm install
npm run dev
```

Vite serves the site at port 5173. No backend, API keys, or environment variables are required. No Git hooks are configured.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

The production site is generated in `dist/`. Deploy that directory to any static host and connect the domain there. Previewing locally does not publish the site or change DNS.

## Desktop

- Single-click desktop shortcuts, Start entries, or welcome cards to launch apps.
- Drag title bars, resize from the bottom-right corner, double-click a title bar to maximize, or use the window controls.
- Taskbar buttons minimize/restore apps; Show desktop minimizes every app.
- Start supports arrow keys, Home/End, and Escape. With a window focused, Alt+M minimizes and Alt+W closes it.
- `#about`, `#projects`, `#writing`, `#contact`, `#notepad`, `#recycle`, and `#settings` open apps directly.
- Small screens use fitted windows. Start and the taskbar remain available.
- Notepad autosaves in the current browser and supports downloading a text file. Display preferences also stay in browser storage. Storage failures do not crash the desktop.
- Sound is optional and off by default; enabling it synthesizes a short app-opening chime.

## Content and assets

Edit profile copy in `src/components/Apps.tsx` and projects, article links, and social links in `src/data.ts`. Article selections were checked against the RSS feed at `https://blog.donvitocodes.com/rss.xml`; this site does not require runtime feed requests. Content references Melvin’s existing DonvitoCodes website and public repositories.

`public/melvin.jpg` is Melvin’s existing profile photo from the DonvitoCodes site. The meadow wallpaper is an original AI-generated landscape, and the SVG icons are custom illustrations. No Microsoft assets or audio are distributed; this is an independent nostalgic desktop tribute. The handwriting font is Patrick Hand from Google Fonts with local cursive fallbacks.

The old Gatsby blog is in the separate `donvito/melvinvivas-com-blog` repository. This implementation does **not** migrate its old article paths. Before moving the existing domain, configure redirects for old article URLs or retain the archive on another host.

Window state and viewport constraints are covered by Node’s built-in test runner. Browser interaction and visual checks are separate from these unit checks.
