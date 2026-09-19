import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

type Op = '+' | '-' | '*' | '/'

interface Calc {
  display: string
  acc: number | null
  op: Op | null
  fresh: boolean
  operand: boolean
  memory: number
}

const init: Calc = { display: '0', acc: null, op: null, fresh: true, operand: false, memory: 0 }

function fmt(n: number) {
  if (!Number.isFinite(n)) return 'Cannot divide by zero'
  const s = String(Math.round(n * 1e12) / 1e12)
  return s.length > 16 ? n.toExponential(8) : s
}

function apply(a: number, op: Op, b: number) {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return a / b
  }
}

function step(s: Calc, key: string): Calc {
  const cur = parseFloat(s.display) || 0
  if (/^[0-9]$/.test(key)) {
    if (s.fresh) return { ...s, display: key, fresh: false, operand: true }
    if (s.display.replace(/[-.]/g, '').length >= 16) return s
    return { ...s, display: s.display === '0' ? key : s.display + key, operand: true }
  }
  switch (key) {
    case '.':
      if (s.fresh) return { ...s, display: '0.', fresh: false, operand: true }
      return s.display.includes('.') ? s : { ...s, display: s.display + '.' }
    case 'C':
      return { ...init, memory: s.memory }
    case 'CE':
      return { ...s, display: '0', fresh: true, operand: true }
    case '⌫':
      if (s.fresh) return s
      return { ...s, display: s.display.length > 1 ? s.display.slice(0, -1) : '0' }
    case '±':
      return { ...s, display: cur === 0 ? '0' : fmt(-cur), operand: true }
    case '√':
      return { ...s, display: fmt(Math.sqrt(cur)), fresh: true, operand: true }
    case '%':
      return { ...s, display: fmt((s.acc ?? 0) * cur / 100), fresh: true, operand: true }
    case '1/x':
      return { ...s, display: fmt(1 / cur), fresh: true, operand: true }
    case 'MC':
      return { ...s, memory: 0 }
    case 'MR':
      return { ...s, display: fmt(s.memory), fresh: true, operand: true }
    case 'MS':
      return { ...s, memory: cur, fresh: true }
    case 'M+':
      return { ...s, memory: s.memory + cur, fresh: true }
    case '+':
    case '-':
    case '*':
    case '/': {
      const op = key as Op
      if (s.op && s.acc !== null && s.operand) {
        const r = apply(s.acc, s.op, cur)
        return { ...s, display: fmt(r), acc: r, op, fresh: true, operand: false }
      }
      return { ...s, acc: s.op && s.acc !== null ? s.acc : cur, op, fresh: true, operand: false }
    }
    case '=': {
      if (s.op === null || s.acc === null) return { ...s, fresh: true }
      const r = apply(s.acc, s.op, cur)
      return { ...s, display: fmt(r), acc: null, op: null, fresh: true, operand: false }
    }
  }
  return s
}

const KEYS: { label: string; key: string; cls?: string; span?: number }[][] = [
  [
    { label: 'MC', key: 'MC', cls: 'red' },
    { label: '7', key: '7' },
    { label: '8', key: '8' },
    { label: '9', key: '9' },
    { label: '/', key: '/', cls: 'red' },
    { label: 'sqrt', key: '√' },
  ],
  [
    { label: 'MR', key: 'MR', cls: 'red' },
    { label: '4', key: '4' },
    { label: '5', key: '5' },
    { label: '6', key: '6' },
    { label: '*', key: '*', cls: 'red' },
    { label: '%', key: '%' },
  ],
  [
    { label: 'MS', key: 'MS', cls: 'red' },
    { label: '1', key: '1' },
    { label: '2', key: '2' },
    { label: '3', key: '3' },
    { label: '-', key: '-', cls: 'red' },
    { label: '1/x', key: '1/x' },
  ],
  [
    { label: 'M+', key: 'M+', cls: 'red' },
    { label: '0', key: '0' },
    { label: '+/-', key: '±' },
    { label: '.', key: '.' },
    { label: '+', key: '+', cls: 'red' },
    { label: '=', key: '=', cls: 'red' },
  ],
]

const KEYMAP: Record<string, string> = {
  Enter: '=',
  '=': '=',
  Backspace: '⌫',
  Delete: 'CE',
  Escape: 'C',
  '%': '%',
  '@': '√',
}

export function CalculatorApp() {
  const [s, setS] = useState<Calc>(init)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  const press = (k: string) => setS((prev) => step(prev, k))

  const onKey = (e: KeyboardEvent) => {
    const k = KEYMAP[e.key] ?? (/^[0-9.+\-*/]$/.test(e.key) ? e.key : null)
    if (!k) return
    e.preventDefault()
    press(k)
  }

  return (
    <>
      <div className="xp-menubar">
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div className="calc" ref={ref} tabIndex={0} onKeyDown={onKey} aria-label="Calculator">
        <div className="calc-display" aria-live="polite">
          {s.display}
        </div>
        <div className="calc-top">
          <div className="calc-mem">{s.memory !== 0 ? 'M' : ''}</div>
          <button className="calc-btn red" onClick={() => press('⌫')}>
            Backspace
          </button>
          <button className="calc-btn red" onClick={() => press('CE')}>
            CE
          </button>
          <button className="calc-btn red" onClick={() => press('C')}>
            C
          </button>
        </div>
        <div className="calc-grid">
          {KEYS.flat().map((k) => (
            <button key={k.key} className={`calc-btn ${k.cls ?? 'blue'}`} onClick={() => press(k.key)}>
              {k.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
