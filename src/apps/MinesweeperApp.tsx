import { useEffect, useState, type MouseEvent } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10

interface Cell {
  mine: boolean
  open: boolean
  flag: boolean
  n: number
}

type Board = Cell[][]

function neighbors(r: number, c: number) {
  const out: [number, number][] = []
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc])
    }
  return out
}

function makeBoard(safeR: number, safeC: number): Board {
  const board: Board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, open: false, flag: false, n: 0 })),
  )
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (board[r][c].mine || (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1)) continue
    board[r][c].mine = true
    placed++
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) board[r][c].n = neighbors(r, c).filter(([nr, nc]) => board[nr][nc].mine).length
  return board
}

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ mine: false, open: false, flag: false, n: 0 })))
}

function flood(board: Board, r: number, c: number) {
  const stack: [number, number][] = [[r, c]]
  while (stack.length) {
    const [cr, cc] = stack.pop()!
    const cell = board[cr][cc]
    if (cell.open || cell.flag) continue
    cell.open = true
    if (cell.n === 0 && !cell.mine) neighbors(cr, cc).forEach((n) => stack.push(n))
  }
}

export function MinesweeperApp() {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [started, setStarted] = useState(false)
  const [state, setState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!started || state !== 'playing') return
    const t = setInterval(() => setSeconds((s) => Math.min(999, s + 1)), 1000)
    return () => clearInterval(t)
  }, [started, state])

  const reset = () => {
    setBoard(emptyBoard())
    setStarted(false)
    setState('playing')
    setSeconds(0)
  }

  const clone = (b: Board): Board => b.map((row) => row.map((cell) => ({ ...cell })))

  const openCell = (r: number, c: number) => {
    if (state !== 'playing') return
    let b = started ? clone(board) : makeBoard(r, c)
    if (!started) setStarted(true)
    const cell = b[r][c]
    if (cell.flag || cell.open) return
    if (cell.mine) {
      b = b.map((row) => row.map((x) => ({ ...x, open: x.mine ? true : x.open })))
      b[r][c].open = true
      setBoard(b)
      setState('lost')
      return
    }
    flood(b, r, c)
    setBoard(b)
    const closed = b.flat().filter((x) => !x.open).length
    if (closed === MINES) setState('won')
  }

  const toggleFlag = (e: MouseEvent, r: number, c: number) => {
    e.preventDefault()
    if (state !== 'playing' || !started) return
    const b = clone(board)
    if (!b[r][c].open) b[r][c].flag = !b[r][c].flag
    setBoard(b)
  }

  const flags = board.flat().filter((x) => x.flag).length
  const face = state === 'won' ? '😎' : state === 'lost' ? '😵' : '🙂'

  return (
    <>
      <div className="xp-menubar">
        <span onClick={reset}>Game</span>
        <span>Help</span>
      </div>
      <div className="mines">
        <div className="mines-head">
          <div className="mines-lcd">{String(MINES - flags).padStart(3, '0')}</div>
          <button className="mines-face" onClick={reset} aria-label="New game">
            {face}
          </button>
          <div className="mines-lcd">{String(seconds).padStart(3, '0')}</div>
        </div>
        <div className="mines-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 22px)` }}>
          {board.map((row, r) =>
            row.map((cell, c) => {
              const cls = ['mines-cell']
              if (cell.open) cls.push('open')
              if (cell.open && cell.mine && state === 'lost') cls.push('boom')
              if (cell.open && cell.n) cls.push('n' + cell.n)
              return (
                <button
                  key={`${r}-${c}`}
                  className={cls.join(' ')}
                  onClick={() => openCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  aria-label={`cell ${r + 1},${c + 1}`}
                >
                  {cell.open ? (cell.mine ? '💣' : cell.n || '') : cell.flag ? '🚩' : ''}
                </button>
              )
            }),
          )}
        </div>
        <div className="mines-hint">
          {state === 'won' ? `You won in ${seconds}s!` : state === 'lost' ? 'Boom. Click the face to try again.' : 'Left click to open · right click to flag'}
        </div>
      </div>
    </>
  )
}
