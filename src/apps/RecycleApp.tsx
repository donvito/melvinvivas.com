import { NotepadIcon, FolderIcon, IEIcon } from '../icons'

const items = [
  {
    icon: IEIcon,
    name: 'melvinvivas.netlify.com',
    detail: 'Gatsby blog theme, 2018–2023',
    note: 'Replaced by this desktop. The posts are still in the Blog app.',
  },
  {
    icon: FolderIcon,
    name: 'GOPATH',
    detail: 'Deleted after Go 1.11 modules',
    note: 'Goodbye GOPATH! (see the blog post)',
  },
  {
    icon: NotepadIcon,
    name: 'jquery-plugins-2009.txt',
    detail: 'Text Document, 12 KB',
    note: 'Some things are best left in the bin.',
  },
  {
    icon: FolderIcon,
    name: 'node_modules',
    detail: '1,048,576 items',
    note: 'Emptying this folder freed 14 GB.',
  },
]

export function RecycleApp() {
  return (
    <>
      <div className="xp-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div className="xp-toolbar">
        <button className="xp-toolbtn" disabled>
          Empty the Recycle Bin
        </button>
        <button className="xp-toolbtn" disabled>
          Restore all items
        </button>
      </div>
      <div className="xp-scroll" style={{ background: '#fff' }}>
        <ul className="recycle-list">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <li key={it.name} title={it.note}>
                <Icon size={32} />
                <div>
                  <b>{it.name}</b>
                  <small>
                    {it.detail} · {it.note}
                  </small>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="xp-statusbar">
        <span>{items.length} objects</span>
        <span>Recycle Bin</span>
      </div>
    </>
  )
}
