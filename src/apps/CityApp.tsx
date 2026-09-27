import { useEffect, useRef, useState } from 'react'

const COLS = 28
const ROWS = 18
const TILE = 18

type Tool = 'road' | 'res' | 'com' | 'ind' | 'power' | 'park' | 'bulldoze'
type Kind = Tool | 'grass' | 'water'

interface Cell {
  kind: Kind
  level: number // 0..5 development density
  powered: boolean
}
interface City {
  cells: Cell[]
  funds: number
  month: number
  pop: number
  jobs: number
  taxRate: number
  log: string[]
}

const COST: Record<Tool, number> = { road: 10, res: 100, com: 100, ind: 100, power: 3000, park: 20, bulldoze: 1 }
const LABEL: Record<Tool, string> = {
  road: 'Road',
  res: 'Residential',
  com: 'Commercial',
  ind: 'Industrial',
  power: 'Power Plant',
  park: 'Park',
  bulldoze: 'Bulldoze',
}
const TOOLS: Tool[] = ['res', 'com', 'ind', 'road', 'power', 'park', 'bulldoze']

function seedMap(): Cell[] {
  const cells: Cell[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const river = Math.abs(c - (COLS - 6) - Math.round(Math.sin(r / 2.5) * 2)) < 2
      cells.push({ kind: river ? 'water' : 'grass', level: 0, powered: false })
    }
  return cells
}

const initial = (): City => ({
  cells: seedMap(),
  funds: 20000,
  month: 0,
  pop: 0,
  jobs: 0,
  taxRate: 7,
  log: ['Welcome, Mayor. Build a power plant, roads, then zone.'],
})

const idx = (r: number, c: number) => r * COLS + c
const neighbors = (i: number) => {
  const r = Math.floor(i / COLS)
  const c = i % COLS
  const out: number[] = []
  if (r > 0) out.push(idx(r - 1, c))
  if (r < ROWS - 1) out.push(idx(r + 1, c))
  if (c > 0) out.push(idx(r, c - 1))
  if (c < COLS - 1) out.push(idx(r, c + 1))
  return out
}
const isZone = (k: Kind) => k === 'res' || k === 'com' || k === 'ind'
const conducts = (k: Kind) => isZone(k) || k === 'road' || k === 'power' || k === 'park'

/** Flood-fill power from every plant through contiguous built tiles. */
function repower(cells: Cell[]) {
  cells.forEach((c) => (c.powered = false))
  const stack = cells.map((c, i) => (c.kind === 'power' ? i : -1)).filter((i) => i >= 0)
  while (stack.length) {
    const i = stack.pop()!
    if (cells[i].powered) continue
    cells[i].powered = true
    for (const n of neighbors(i)) if (!cells[n].powered && conducts(cells[n].kind)) stack.push(n)
  }
}

function simulate(city: City): City {
  const cells = city.cells.map((c) => ({ ...c }))
  repower(cells)
  const roadAdj = (i: number) => neighbors(i).some((n) => cells[n].kind === 'road')

  let pop = 0
  let jobs = 0
  let res = 0
  let com = 0
  let ind = 0
  cells.forEach((c) => {
    if (c.kind === 'res') {
      pop += c.level * 40
      res++
    }
    if (c.kind === 'com') {
      jobs += c.level * 25
      com++
    }
    if (c.kind === 'ind') {
      jobs += c.level * 40
      ind++
    }
  })
  const rDemand = jobs + 80 - pop
  const cDemand = pop / 3 - com * 60
  const iDemand = pop / 2 - ind * 60

  const pollution = new Map<number, number>()
  cells.forEach((c, i) => {
    if (c.kind === 'ind' || c.kind === 'power') {
      const src = c.kind === 'power' ? 3 : c.level
      for (const n of neighbors(i)) pollution.set(n, (pollution.get(n) ?? 0) + src)
    }
  })

  cells.forEach((c, i) => {
    if (!isZone(c.kind)) return
    const ok = c.powered && roadAdj(i)
    const demand = c.kind === 'res' ? rDemand : c.kind === 'com' ? cDemand : iDemand
    const parkBonus = neighbors(i).filter((n) => cells[n].kind === 'park').length
    const smog = c.kind === 'res' ? (pollution.get(i) ?? 0) : 0
    let want = ok ? (demand > 0 ? 1 : demand < -40 ? -1 : 0) : -1
    if (c.kind === 'res' && smog > parkBonus + 2) want = Math.min(want, 0)
    if (Math.random() < 0.35) c.level = Math.max(0, Math.min(5, c.level + want))
  })

  pop = 0
  jobs = 0
  cells.forEach((c) => {
    if (c.kind === 'res') pop += c.level * 40
    if (c.kind === 'com') jobs += c.level * 25
    if (c.kind === 'ind') jobs += c.level * 40
  })

  const roads = cells.filter((c) => c.kind === 'road').length
  const plants = cells.filter((c) => c.kind === 'power').length
  const income = Math.round((pop * 0.6 + jobs * 0.4) * (city.taxRate / 100))
  const expenses = roads * 1 + plants * 60
  const funds = city.funds + income - expenses
  const month = city.month + 1
  const log = [...city.log]
  if (month % 12 === 0) log.unshift(`Year ${month / 12}: pop ${pop}, jobs ${jobs}, net $${income - expenses}/mo`)
  if (pop > 0 && jobs < pop / 3 && Math.random() < 0.1) log.unshift('Residents demand more jobs — zone commercial/industrial.')
  if (jobs > pop && Math.random() < 0.1) log.unshift('Businesses need workers — zone more residential.')
  if (plants === 0 && (res + com + ind) > 0 && Math.random() < 0.15) log.unshift('Zones are unpowered. Build a power plant.')
  if (funds < 0 && Math.random() < 0.2) log.unshift('The city is broke! Raise taxes or cut roads.')
  return { ...city, cells, funds, month, pop, jobs, log: log.slice(0, 6) }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function draw(ctx: CanvasRenderingContext2D, city: City, hover: number | null, tool: Tool) {
  const { cells } = city
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i]
    const x = (i % COLS) * TILE
    const y = Math.floor(i / COLS) * TILE
    ctx.fillStyle = c.kind === 'water' ? '#2b6cb0' : '#3f9b3f'
    ctx.fillRect(x, y, TILE, TILE)
    if (c.kind === 'grass' && (i * 7919) % 5 === 0) {
      ctx.fillStyle = '#4caf4c'
      ctx.fillRect(x + 4, y + 6, 3, 3)
    }
    switch (c.kind) {
      case 'road': {
        ctx.fillStyle = '#555'
        ctx.fillRect(x, y, TILE, TILE)
        ctx.fillStyle = '#ddd'
        const n = neighbors(i).map((j) => cells[j].kind === 'road')
        const up = i - COLS >= 0 && cells[i - COLS].kind === 'road'
        const down = i + COLS < cells.length && cells[i + COLS].kind === 'road'
        if (up || down || !n.some(Boolean)) ctx.fillRect(x + TILE / 2 - 1, y + 2, 2, TILE - 4)
        const left = i % COLS > 0 && cells[i - 1].kind === 'road'
        const right = i % COLS < COLS - 1 && cells[i + 1].kind === 'road'
        if (left || right) ctx.fillRect(x + 2, y + TILE / 2 - 1, TILE - 4, 2)
        break
      }
      case 'res':
      case 'com':
      case 'ind': {
        const base = c.kind === 'res' ? '#5ac85a' : c.kind === 'com' ? '#5a8ad8' : '#d8b25a'
        ctx.fillStyle = base
        ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2)
        if (c.level > 0) {
          const h = 3 + c.level * 2
          const dark = c.kind === 'res' ? '#2f7a2f' : c.kind === 'com' ? '#264d8f' : '#8f6b1e'
          ctx.fillStyle = dark
          ctx.fillRect(x + 3, y + TILE - 2 - h, TILE - 6, h)
          ctx.fillStyle = '#fff59d'
          for (let w = 0; w < c.level; w++) ctx.fillRect(x + 4 + (w % 3) * 4, y + TILE - 4 - Math.floor(w / 3) * 4 - 1, 2, 2)
        } else {
          ctx.strokeStyle = 'rgba(0,0,0,0.25)'
          ctx.strokeRect(x + 2.5, y + 2.5, TILE - 5, TILE - 5)
        }
        if (!c.powered) {
          ctx.fillStyle = '#ff0'
          ctx.font = 'bold 10px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('⚡', x + TILE / 2, y + TILE / 2)
        }
        break
      }
      case 'power':
        ctx.fillStyle = '#777'
        ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2)
        ctx.fillStyle = '#333'
        ctx.fillRect(x + 4, y + 3, 4, 8)
        ctx.fillRect(x + 10, y + 3, 4, 8)
        ctx.fillStyle = '#e53'
        ctx.fillRect(x + 3, y + 12, TILE - 6, 3)
        break
      case 'park':
        ctx.fillStyle = '#2e8b2e'
        ctx.beginPath()
        ctx.arc(x + TILE / 2, y + TILE / 2 - 1, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#6b3'
        ctx.fillRect(x + TILE / 2 - 1, y + TILE / 2 + 2, 2, 5)
        break
    }
  }
  if (hover !== null) {
    const x = (hover % COLS) * TILE
    const y = Math.floor(hover / COLS) * TILE
    ctx.strokeStyle = tool === 'bulldoze' ? '#f33' : '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2)
    ctx.lineWidth = 1
  }
}

export function CityApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [city, setCity] = useState<City>(initial)
  const [tool, setTool] = useState<Tool>('road')
  const [hover, setHover] = useState<number | null>(null)
  const [speed, setSpeed] = useState<0 | 1 | 2>(1)
  const painting = useRef(false)

  useEffect(() => {
    if (speed === 0) return
    const id = window.setInterval(() => setCity((c) => simulate(c)), speed === 1 ? 1500 : 500)
    return () => window.clearInterval(id)
  }, [speed])

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (ctx) draw(ctx, city, hover, tool)
  }, [city, hover, tool])

  const place = (i: number) => {
    setCity((c) => {
      const cell = c.cells[i]
      if (cell.kind === 'water' && tool !== 'bulldoze') return c
      if (tool === 'bulldoze') {
        if (cell.kind === 'grass' || cell.kind === 'water') return c
      } else if (cell.kind === tool) return c
      else if (cell.kind !== 'grass') return c
      if (c.funds < COST[tool]) return { ...c, log: ['Not enough funds.', ...c.log].slice(0, 6) }
      const cells = c.cells.slice()
      cells[i] = { kind: tool === 'bulldoze' ? 'grass' : tool, level: 0, powered: false }
      repower(cells)
      return { ...c, cells, funds: c.funds - COST[tool] }
    })
  }

  const cellAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * COLS)
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS)
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return null
    return idx(r, c)
  }

  return (
    <>
      <div className="xp-menubar">
        <span onClick={() => setCity(initial())}>New City</span>
        <span onClick={() => setSpeed((s) => (s === 0 ? 1 : 0))}>{speed === 0 ? 'Resume' : 'Pause'}</span>
        <span onClick={() => setSpeed(speed === 2 ? 1 : 2)}>{speed === 2 ? 'Normal speed' : 'Fast'}</span>
        <span onClick={() => setCity((c) => ({ ...c, taxRate: Math.max(0, c.taxRate - 1) }))}>Tax −</span>
        <span onClick={() => setCity((c) => ({ ...c, taxRate: Math.min(20, c.taxRate + 1) }))}>Tax +</span>
      </div>
      <div className="city">
        <div className="city-tools">
          {TOOLS.map((t) => (
            <button key={t} className={`xp-btn city-tool${tool === t ? ' active' : ''}`} onClick={() => setTool(t)} title={`${LABEL[t]} — $${COST[t]}`}>
              <i className={`city-swatch city-${t}`} />
              {LABEL[t]}
              <small>${COST[t]}</small>
            </button>
          ))}
          <div className="city-log">
            {city.log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
        <canvas
          ref={canvas}
          width={COLS * TILE}
          height={ROWS * TILE}
          aria-label="City map"
          onPointerDown={(e) => {
            painting.current = true
            const i = cellAt(e)
            if (i !== null) place(i)
          }}
          onPointerMove={(e) => {
            const i = cellAt(e)
            setHover(i)
            if (painting.current && i !== null && (tool === 'road' || tool === 'bulldoze')) place(i)
          }}
          onPointerUp={() => (painting.current = false)}
          onPointerLeave={() => {
            painting.current = false
            setHover(null)
          }}
        />
      </div>
      <div className="arcade-status">
        <span>
          {MONTHS[city.month % 12]} {1900 + Math.floor(city.month / 12)} · Funds ${city.funds.toLocaleString()} · Tax {city.taxRate}%
        </span>
        <span>
          Pop {city.pop.toLocaleString()} · Jobs {city.jobs.toLocaleString()}
        </span>
      </div>
    </>
  )
}
