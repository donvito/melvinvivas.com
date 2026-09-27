# melvinvivas.com

Personal website of Melvin Dave Vivas, built as a Windows XP desktop simulation.
Each section of the site is an "app" you open from the desktop or Start menu.

| App | Window | Deep link |
| --- | --- | --- |
| About Me | Notepad | `/#about` |
| My Projects | Windows Explorer | `/#projects` |
| Blog | Internet Explorer | `/#blog` |
| Videos | Windows Media Player | `/#videos` |
| Resume | WordPad | `/#resume` |
| Contact | Outlook Express | `/#contact` |
| Minesweeper | Minesweeper | `/#minesweeper` |

## Development

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
```

## Editing content

All content lives in typed data modules under `src/data/`:

- `profile.ts` – name, bio, links, skills, career timeline
- `projects.ts` – project cards shown in My Projects
- `posts.ts` – blog post index shown in the Blog app
- `videos.ts` – YouTube videos shown in the Videos app

Set `profile.email` to enable the `mailto:` send button in the Contact app.

## Stack

Vite, React 19, TypeScript, plain CSS. No UI dependencies.
