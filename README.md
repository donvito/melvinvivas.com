# melvinvivas.com

Personal website of Melvin Vivas — a **Windows XP desktop simulation** where each page is an app you open.

Pure static HTML/CSS/JS. No build step, no dependencies.

## Run locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

or just open `index.html` in a browser.

## What's inside

- Boot screen → Welcome (login) → desktop with Bliss-style wallpaper
- Draggable/minimizable/maximizable windows with a taskbar, Start menu, and live clock
- Apps: My Computer, About Melvin, Projects, Writing (blog archive links), Internet Explorer (links + working address bar), resume.txt in Notepad, a working Command Prompt, playable Minesweeper, Recycle Bin, and a full Turn Off Computer flow

## Deploy

Any static host works — Netlify, Vercel, GitHub Pages, S3. Serve the repo root.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Boot/welcome/desktop DOM, taskbar, start menu |
| `css/xp.css` | Luna theme styles + app content styles |
| `js/icons.js` | SVG icon set |
| `js/apps.js` | App registry — window contents and behavior |
| `js/desktop.js` | Window manager, drag, taskbar, start menu, boot/shutdown |
| `js/minesweeper.js` | Minesweeper game |
| `assets/bliss.jpg` | Desktop wallpaper |
