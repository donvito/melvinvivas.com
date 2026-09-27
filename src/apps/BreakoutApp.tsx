import { useRef, useState } from 'react'
import { clamp, text, useArcade } from './arcade'

const W = 480
const H = 360
const COLS = 12
const ROWS = 6
const BW = W / COLS
const BH = 16
const TOP = 40
const PAD_W = 64
const PAD_H = 8
const PAD_Y = H - 24
const BALL = 6
const COLORS = ['#d33', '#e73', '#eb3', '#3b3', '#38d', '#93d']

interface State {
  px: number
  bx: number
  by: number
  vx: number
  vy: number
  bricks: boolean[]
  score: number
  lives: number
  level: number
  phase: 'serve' | 'play' | 'over' | 'won'
}

const wall = () => Array<boolean>(COLS * ROWS).fill(true)

function reset(s: State): State {
  return { ...s, px: W / 2, bx: W / 2, by: PAD_Y - 10, vx: 0, vy: 0, phase: 'serve' }
}

const fresh = (): State => reset({ px: 0, bx: 0, by: 0, vx: 0, vy: 0, bricks: wall(), score: 0, lives: 3, level: 1, phase: 'serve' })

export function BreakoutApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const st = useRef<State>(fresh())
  const [hud, setHud] = useState({ score: 0, lives: 3, level: 1 })

  useArcade(
    canvas,
    (ctx, dt, input) => {
      let s = st.current
      const speed = 200 + s.level * 30
      if (input.pressed.has('Space')) {
        if (s.phase === 'over' || s.phase === 'won') s = fresh()
        else if (s.phase === 'serve') {
          const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.8
          s = { ...s, phase: 'play', vx: Math.cos(a) * speed, vy: Math.sin(a) * speed }
        }
      }
      const left = input.down.has('ArrowLeft') || input.down.has('KeyA')
      const right = input.down.has('ArrowRight') || input.down.has('KeyD')
      if (left) s.px -= 360 * dt
      if (right) s.px += 360 * dt
      s.px = clamp(s.px, PAD_W / 2, W - PAD_W / 2)
      if (s.phase === 'serve') s.bx = s.px

      if (s.phase === 'play') {
        s.bx += s.vx * dt
        s.by += s.vy * dt
        if (s.bx < BALL || s.bx > W - BALL) {
          s.bx = clamp(s.bx, BALL, W - BALL)
          s.vx = -s.vx
        }
        if (s.by < BALL) {
          s.by = BALL
          s.vy = -s.vy
        }
        if (s.vy > 0 && s.by + BALL >= PAD_Y && s.by - BALL <= PAD_Y + PAD_H && Math.abs(s.bx - s.px) <= PAD_W / 2 + BALL) {
          const rel = (s.bx - s.px) / (PAD_W / 2)
          const a = -Math.PI / 2 + rel * 1.1
          const v = Math.min(Math.hypot(s.vx, s.vy) * 1.02, 480)
          s.vx = Math.cos(a) * v
          s.vy = Math.sin(a) * v
          s.by = PAD_Y - BALL
        }
        const c = Math.floor(s.bx / BW)
        const r = Math.floor((s.by - TOP) / BH)
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && s.bricks[r * COLS + c]) {
          s.bricks[r * COLS + c] = false
          s.score += (ROWS - r) * 10
          const cx = c * BW + BW / 2
          const cy = TOP + r * BH + BH / 2
          if (Math.abs(s.bx - cx) / BW > Math.abs(s.by - cy) / BH) s.vx = -s.vx
          else s.vy = -s.vy
          if (!s.bricks.some(Boolean)) {
            s = reset({ ...s, bricks: wall(), level: s.level + 1 })
            if (s.level > 3) s.phase = 'won'
          }
        }
        if (s.by > H + BALL) {
          s.lives--
          s = s.lives <= 0 ? { ...s, phase: 'over' } : reset(s)
        }
      }
      st.current = s
      setHud((p) => (p.score === s.score && p.lives === s.lives && p.level === s.level ? p : { score: s.score, lives: s.lives, level: s.level }))

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (s.bricks[r * COLS + c]) {
            ctx.fillStyle = COLORS[r % COLORS.length]
            ctx.fillRect(c * BW + 1, TOP + r * BH + 1, BW - 2, BH - 2)
          }
      ctx.fillStyle = '#ddd'
      ctx.fillRect(s.px - PAD_W / 2, PAD_Y, PAD_W, PAD_H)
      if (s.phase === 'serve' || s.phase === 'play') ctx.fillRect(s.bx - BALL / 2, s.by - BALL / 2, BALL, BALL)
      text(ctx, `SCORE ${s.score}`, 8, 14, 12, '#fff', 'left')
      text(ctx, `LEVEL ${Math.min(s.level, 3)}`, W / 2, 14, 12)
      text(ctx, `LIVES ${s.lives}`, W - 8, 14, 12, '#fff', 'right')
      if (s.phase === 'serve') text(ctx, 'SPACE TO LAUNCH', W / 2, H / 2 + 40, 12)
      if (s.phase === 'over') text(ctx, 'GAME OVER  —  SPACE TO RESTART', W / 2, H / 2, 16)
      if (s.phase === 'won') text(ctx, 'YOU CLEARED ALL LEVELS!', W / 2, H / 2, 16)
    },
    ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'],
  )

  return (
    <>
      <div className="xp-menubar">
        <span
          onClick={() => {
            st.current = fresh()
            setHud({ score: 0, lives: 3, level: 1 })
            canvas.current?.focus()
          }}
        >
          Game
        </span>
        <span>Help</span>
      </div>
      <div className="arcade">
        <canvas ref={canvas} width={W} height={H} tabIndex={0} onPointerDown={(e) => e.currentTarget.focus()} aria-label="Breakout" />
        <div className="arcade-status">
          <span>Score {hud.score} · Lives {hud.lives}</span>
          <span>←/→ move · Space launch</span>
        </div>
      </div>
    </>
  )
}
