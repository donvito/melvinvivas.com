import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type PointerEvent as RPointerEvent } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'

interface Card {
  id: string
  suit: Suit
  rank: number
  up: boolean
}

type Loc = { pile: 'waste' } | { pile: 'found'; i: number } | { pile: 'tab'; i: number; idx: number }
type Target = { pile: 'found'; i: number } | { pile: 'tab'; i: number }

interface Game {
  stock: Card[]
  waste: Card[]
  found: Card[][]
  tab: Card[][]
  moves: number
  draw: 1 | 3
}

interface Drag {
  from: Loc
  cards: Card[]
  x: number
  y: number
  dx: number
  dy: number
  moved: boolean
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const isRed = (s: Suit) => s === '♥' || s === '♦'

function deal(draw: 1 | 3): Game {
  const deck: Card[] = []
  for (const suit of SUITS) for (let rank = 1; rank <= 13; rank++) deck.push({ id: suit + rank, suit, rank, up: false })
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  const tab: Card[][] = []
  for (let i = 0; i < 7; i++) {
    const col = deck.splice(0, i + 1)
    col[col.length - 1].up = true
    tab.push(col)
  }
  return { stock: deck, waste: [], found: [[], [], [], []], tab, moves: 0, draw }
}

function canTab(card: Card, pile: Card[]) {
  const top = pile[pile.length - 1]
  if (!top) return card.rank === 13
  return top.up && isRed(top.suit) !== isRed(card.suit) && top.rank === card.rank + 1
}

function canFound(card: Card, pile: Card[]) {
  const top = pile[pile.length - 1]
  if (!top) return card.rank === 1
  return top.suit === card.suit && top.rank === card.rank + 1
}

function pick(g: Game, from: Loc): Card[] {
  if (from.pile === 'waste') return g.waste.slice(-1)
  if (from.pile === 'found') return g.found[from.i].slice(-1)
  return g.tab[from.i].slice(from.idx)
}

function move(g: Game, from: Loc, to: Target): Game | null {
  const cards = pick(g, from)
  if (!cards.length) return null
  if (from.pile !== 'waste' && from.pile === to.pile && from.i === to.i) return null
  if (to.pile === 'found') {
    if (cards.length !== 1 || !canFound(cards[0], g.found[to.i])) return null
  } else if (!canTab(cards[0], g.tab[to.i])) return null

  const n: Game = { ...g, waste: [...g.waste], found: g.found.map((p) => [...p]), tab: g.tab.map((p) => [...p]), moves: g.moves + 1 }
  if (from.pile === 'waste') n.waste.pop()
  else if (from.pile === 'found') n.found[from.i].pop()
  else {
    n.tab[from.i] = n.tab[from.i].slice(0, from.idx)
    const col = n.tab[from.i]
    if (col.length && !col[col.length - 1].up) col[col.length - 1] = { ...col[col.length - 1], up: true }
  }
  if (to.pile === 'found') n.found[to.i].push(cards[0])
  else n.tab[to.i].push(...cards)
  return n
}

function autoFound(g: Game, from: Loc): Game | null {
  const cards = pick(g, from)
  if (cards.length !== 1) return null
  for (let i = 0; i < 4; i++) {
    const n = move(g, from, { pile: 'found', i })
    if (n) return n
  }
  return null
}

function drawCard(g: Game): Game {
  if (!g.stock.length) {
    if (!g.waste.length) return g
    return { ...g, stock: [...g.waste].reverse().map((c) => ({ ...c, up: false })), waste: [], moves: g.moves + 1 }
  }
  const k = Math.min(g.draw, g.stock.length)
  const taken = g.stock.slice(-k).reverse().map((c) => ({ ...c, up: true }))
  return { ...g, stock: g.stock.slice(0, -k), waste: [...g.waste, ...taken], moves: g.moves + 1 }
}

function sameLoc(a: Loc, b: Loc) {
  if (a.pile !== b.pile) return false
  if (a.pile === 'waste') return true
  if (a.pile === 'found' && b.pile === 'found') return a.i === b.i
  if (a.pile === 'tab' && b.pile === 'tab') return a.i === b.i && a.idx === b.idx
  return false
}

function CardView({ card, style, className = '', ...rest }: { card: Card; style?: CSSProperties; className?: string } & HTMLAttributes<HTMLDivElement>) {
  if (!card.up) return <div className={`sol-card down ${className}`} style={style} {...rest} />
  return (
    <div className={`sol-card up ${isRed(card.suit) ? 'red' : 'black'} ${className}`} style={style} {...rest}>
      <span className="sol-corner">
        {RANKS[card.rank - 1]}
        <br />
        {card.suit}
      </span>
      <span className="sol-pip">{card.suit}</span>
      <span className="sol-corner flip">
        {RANKS[card.rank - 1]}
        <br />
        {card.suit}
      </span>
    </div>
  )
}

export function SolitaireApp() {
  const [g, setG] = useState<Game>(() => deal(1))
  const [drag, setDrag] = useState<Drag | null>(null)
  const [sel, setSel] = useState<Loc | null>(null)
  const [seconds, setSeconds] = useState(0)
  const dragRef = useRef<Drag | null>(null)
  const gRef = useRef(g)
  const selRef = useRef(sel)
  const won = g.found.every((p) => p.length === 13)
  const started = g.moves > 0
  const dragging = drag !== null

  useEffect(() => {
    gRef.current = g
    selRef.current = sel
  }, [g, sel])

  useEffect(() => {
    if (won || !started) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [won, started])

  const newGame = (draw: 1 | 3 = g.draw) => {
    setG(deal(draw))
    setSel(null)
    setSeconds(0)
  }

  const commit = (n: Game | null) => {
    if (n) setG(n)
    setSel(null)
    return !!n
  }

  const startDrag = (e: RPointerEvent<HTMLDivElement>, from: Loc) => {
    if (e.button !== 0) return
    const cards = pick(g, from)
    if (!cards.length || !cards[0].up) return
    e.preventDefault()
    const r = e.currentTarget.getBoundingClientRect()
    const d: Drag = { from, cards, x: r.left, y: r.top, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false }
    dragRef.current = d
    setDrag(d)
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const nx = e.clientX - d.dx
      const ny = e.clientY - d.dy
      const moved = d.moved || Math.hypot(nx - d.x, ny - d.y) > 4
      dragRef.current = { ...d, x: nx, y: ny, moved }
      setDrag(dragRef.current)
    }
    const onUp = (e: PointerEvent) => {
      const d = dragRef.current
      dragRef.current = null
      setDrag(null)
      if (!d) return
      const cur = gRef.current
      const s = selRef.current
      if (!d.moved) {
        if (s && !sameLoc(s, d.from)) {
          const target: Target | null = d.from.pile === 'waste' ? null : d.from.pile === 'found' ? { pile: 'found', i: d.from.i } : { pile: 'tab', i: d.from.i }
          if (target && commit(move(cur, s, target))) return
        }
        setSel(s && sameLoc(s, d.from) ? null : d.from)
        return
      }
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const drop = el?.closest<HTMLElement>('[data-pile]')
      if (!drop) return
      const target: Target = { pile: drop.dataset.pile as 'tab' | 'found', i: Number(drop.dataset.index) }
      commit(move(cur, d.from, target))
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging])

  const hidden = (loc: Loc) => {
    const d = drag
    if (!d || !d.moved) return false
    if (d.from.pile !== loc.pile) return false
    if (d.from.pile === 'waste') return true
    if (d.from.pile === 'found' && loc.pile === 'found') return d.from.i === loc.i
    if (d.from.pile === 'tab' && loc.pile === 'tab') return d.from.i === loc.i && loc.idx >= d.from.idx
    return false
  }

  const isSel = (loc: Loc) => {
    if (!sel) return false
    if (sel.pile === 'tab' && loc.pile === 'tab') return sel.i === loc.i && loc.idx >= sel.idx
    return sameLoc(sel, loc)
  }

  const onEmptyClick = (target: Target) => {
    if (sel) commit(move(g, sel, target))
  }

  const wasteTop = g.waste[g.waste.length - 1]
  const wasteShown = g.waste.slice(-(g.draw === 3 ? 3 : 1))

  return (
    <>
      <div className="xp-menubar">
        <span onClick={() => newGame()}>Game</span>
        <span onClick={() => newGame(g.draw === 1 ? 3 : 1)} title="Toggle draw one / draw three">
          Draw {g.draw === 1 ? 'One' : 'Three'}
        </span>
        <span>Help</span>
      </div>
      <div className="sol">
        <div className="sol-row">
          <div className={`sol-slot stock ${g.stock.length ? '' : 'empty'}`} onClick={() => commit(drawCard(g))} role="button" aria-label="Stock">
            {g.stock.length ? <div className="sol-card down" /> : <span className="sol-redeal">↻</span>}
          </div>
          <div className="sol-slot waste" aria-label="Waste">
            {wasteShown.map((c, k) => {
              const top = c === wasteTop
              const loc: Loc = { pile: 'waste' }
              return (
                <CardView
                  key={c.id}
                  card={c}
                  className={`${top && isSel(loc) ? 'sel' : ''} ${top && hidden(loc) ? 'ghost' : ''}`}
                  style={{ left: k * 14 }}
                  onPointerDown={top ? (e) => startDrag(e, loc) : undefined}
                  onDoubleClick={top ? () => commit(autoFound(g, loc)) : undefined}
                />
              )
            })}
          </div>
          <div className="sol-gap" />
          {g.found.map((p, i) => {
            const top = p[p.length - 1]
            const loc: Loc = { pile: 'found', i }
            return (
              <div key={i} className="sol-slot found" data-pile="found" data-index={i} onClick={() => !top && onEmptyClick({ pile: 'found', i })}>
                {top && (
                  <CardView
                    card={top}
                    className={`${isSel(loc) ? 'sel' : ''} ${hidden(loc) ? 'ghost' : ''} ${won ? 'bounce' : ''}`}
                    style={won ? { animationDelay: `${i * 0.15}s` } : undefined}
                    onPointerDown={(e) => startDrag(e, loc)}
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="sol-row tableau">
          {g.tab.map((col, i) => (
            <div key={i} className="sol-slot tab" data-pile="tab" data-index={i} onClick={() => !col.length && onEmptyClick({ pile: 'tab', i })}>
              {col.map((c, idx) => {
                const loc: Loc = { pile: 'tab', i, idx }
                const y = col.slice(0, idx).reduce((acc, x) => acc + (x.up ? 20 : 7), 0)
                return (
                  <CardView
                    key={c.id}
                    card={c}
                    className={`${isSel(loc) ? 'sel' : ''} ${hidden(loc) ? 'ghost' : ''}`}
                    style={{ top: y, zIndex: idx + 1 }}
                    onPointerDown={c.up ? (e) => startDrag(e, loc) : undefined}
                    onDoubleClick={c.up && idx === col.length - 1 ? () => commit(autoFound(g, loc)) : undefined}
                  />
                )
              })}
            </div>
          ))}
        </div>
        {drag?.moved && (
          <div className="sol-drag" style={{ left: drag.x, top: drag.y }}>
            {drag.cards.map((c, k) => (
              <CardView key={c.id} card={c} style={{ top: k * 20 }} />
            ))}
          </div>
        )}
        {won && (
          <div className="sol-win">
            <div>You won in {g.moves} moves!</div>
            <button className="xp-btn" onClick={() => newGame()}>
              Deal again
            </button>
          </div>
        )}
      </div>
      <div className="sol-status">
        <span>Moves: {g.moves}</span>
        <span>Time: {seconds}s</span>
        <span>Stock: {g.stock.length}</span>
      </div>
    </>
  )
}
