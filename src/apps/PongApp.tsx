import { useRef, useState } from 'react'
import { clamp, text, useArcade } from './arcade'

const W = 480
const H = 320
const PAD_H = 56
const PAD_W = 8
const BALL = 8
const WIN = 7

interface State {
  py: number
  cy: number
  bx: number
  by: number
  vx: number
  vy: number
  ps: number
  cs: number
  phase: 'serve' | 'play' | 'over'
  msg: string
}

function serve(s: State, dir: 1 | -1): State {
  const angle = (Math.random() - 0.5) * 0.8
  return { ...s, bx: W / 2, by: H / 2, vx: 220 * dir * Math.cos(angle), vy: 220 * Math.sin(angle), phase: 'serve' }
}

const fresh = (): State => serve({ py: H / 2, cy: H / 2, bx: 0, by: 0, vx: 0, vy: 0, ps: 0, cs: 0, phase: 'serve', msg: '' }, 1)

export function PongApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const st = useRef<State>(fresh())
  const [score, setScore] = useState([0, 0])

  useArcade(
    canvas,
    (ctx, dt, input) => {
      let s = st.current
      if (input.pressed.has('Space')) {
        if (s.phase === 'over') s = fresh()
        if (s.phase === 'serve') s = { ...s, phase: 'play', msg: '' }
      }
      const up = input.down.has('ArrowUp') || input.down.has('KeyW')
      const dn = input.down.has('ArrowDown') || input.down.has('KeyS')
      if (up) s.py = clamp(s.py - 300 * dt, PAD_H / 2, H - PAD_H / 2)
      if (dn) s.py = clamp(s.py + 300 * dt, PAD_H / 2, H - PAD_H / 2)

      if (s.phase === 'play') {
        const target = s.vx > 0 ? s.by + s.vy * 0.15 : H / 2
        const cpuSpeed = 210
        s.cy = clamp(s.cy + clamp(target - s.cy, -cpuSpeed * dt, cpuSpeed * dt), PAD_H / 2, H - PAD_H / 2)

        s.bx += s.vx * dt
        s.by += s.vy * dt
        if (s.by < BALL / 2 || s.by > H - BALL / 2) {
          s.by = clamp(s.by, BALL / 2, H - BALL / 2)
          s.vy = -s.vy
        }
        const hit = (px: number, py: number) => Math.abs(s.bx - px) < PAD_W / 2 + BALL / 2 && Math.abs(s.by - py) < PAD_H / 2 + BALL / 2
        if (s.vx < 0 && hit(20, s.py)) {
          s.vx = Math.abs(s.vx) * 1.06
          s.vy += (s.by - s.py) * 5
          s.bx = 20 + PAD_W / 2 + BALL / 2
        } else if (s.vx > 0 && hit(W - 20, s.cy)) {
          s.vx = -Math.abs(s.vx) * 1.06
          s.vy += (s.by - s.cy) * 5
          s.bx = W - 20 - PAD_W / 2 - BALL / 2
        }
        s.vx = clamp(s.vx, -600, 600)
        if (s.bx < -BALL) {
          s.cs++
          s = serve(s, -1)
        } else if (s.bx > W + BALL) {
          s.ps++
          s = serve(s, 1)
        }
        if (s.ps >= WIN || s.cs >= WIN) s = { ...s, phase: 'over', msg: s.ps > s.cs ? 'YOU WIN' : 'CPU WINS' }
      }
      st.current = s
      setScore((p) => (p[0] === s.ps && p[1] === s.cs ? p : [s.ps, s.cs]))

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      for (let y = 0; y < H; y += 20) ctx.fillRect(W / 2 - 1, y, 2, 10)
      ctx.fillRect(20 - PAD_W / 2, s.py - PAD_H / 2, PAD_W, PAD_H)
      ctx.fillRect(W - 20 - PAD_W / 2, s.cy - PAD_H / 2, PAD_W, PAD_H)
      if (s.phase !== 'over') ctx.fillRect(s.bx - BALL / 2, s.by - BALL / 2, BALL, BALL)
      text(ctx, String(s.ps), W / 2 - 40, 30, 32)
      text(ctx, String(s.cs), W / 2 + 40, 30, 32)
      if (s.phase === 'serve') text(ctx, 'PRESS SPACE TO SERVE', W / 2, H - 40, 12)
      if (s.phase === 'over') {
        text(ctx, s.msg, W / 2, H / 2 - 10, 28)
        text(ctx, 'SPACE TO PLAY AGAIN', W / 2, H / 2 + 24, 12)
      }
    },
    ['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS', 'Space'],
  )

  return (
    <>
      <div className="xp-menubar">
        <span
          onClick={() => {
            st.current = fresh()
            setScore([0, 0])
            canvas.current?.focus()
          }}
        >
          Game
        </span>
        <span>Help</span>
      </div>
      <div className="arcade">
        <canvas ref={canvas} width={W} height={H} tabIndex={0} onPointerDown={(e) => e.currentTarget.focus()} aria-label="Pong" />
        <div className="arcade-status">
          <span>You {score[0]} – CPU {score[1]}</span>
          <span>↑/↓ move · Space serve · first to {WIN}</span>
        </div>
      </div>
    </>
  )
}
