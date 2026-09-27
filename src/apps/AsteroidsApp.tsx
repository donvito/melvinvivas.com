import { useRef, useState } from 'react'
import { text, useArcade } from './arcade'

const W = 480
const H = 400
const TAU = Math.PI * 2

interface Body {
  x: number
  y: number
  vx: number
  vy: number
}
interface Rock extends Body {
  r: number
  rot: number
  spin: number
  shape: number[]
}
interface Shot extends Body {
  life: number
}
interface State {
  ship: Body & { a: number }
  rocks: Rock[]
  shots: Shot[]
  score: number
  lives: number
  wave: number
  phase: 'ready' | 'play' | 'dead' | 'over'
  t: number
  cooldown: number
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)

function rock(x: number, y: number, r: number): Rock {
  const a = rnd(0, TAU)
  const v = rnd(30, 70) * (40 / r)
  return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, rot: 0, spin: rnd(-1, 1), shape: Array.from({ length: 10 }, () => rnd(0.7, 1.15)) }
}

function spawnWave(n: number): Rock[] {
  return Array.from({ length: n }, () => {
    const edge = Math.random() < 0.5
    const x = edge ? (Math.random() < 0.5 ? 0 : W) : rnd(0, W)
    const y = edge ? rnd(0, H) : Math.random() < 0.5 ? 0 : H
    return rock(x, y, 40)
  })
}

const fresh = (): State => ({
  ship: { x: W / 2, y: H / 2, vx: 0, vy: 0, a: -Math.PI / 2 },
  rocks: spawnWave(4),
  shots: [],
  score: 0,
  lives: 3,
  wave: 1,
  phase: 'ready',
  t: 0,
  cooldown: 0,
})

const wrap = (b: Body) => {
  if (b.x < 0) b.x += W
  if (b.x > W) b.x -= W
  if (b.y < 0) b.y += H
  if (b.y > H) b.y -= H
}

export function AsteroidsApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const st = useRef<State>(fresh())
  const [hud, setHud] = useState({ score: 0, lives: 3 })

  useArcade(
    canvas,
    (ctx, dt, input) => {
      let s = st.current
      s.t += dt
      if (input.pressed.has('Space') || input.pressed.has('Enter')) {
        if (s.phase === 'over') s = fresh()
        if (s.phase === 'ready') s.phase = 'play'
      }
      const { ship } = s
      if (s.phase === 'play') {
        if (input.down.has('ArrowLeft') || input.down.has('KeyA')) ship.a -= 4 * dt
        if (input.down.has('ArrowRight') || input.down.has('KeyD')) ship.a += 4 * dt
        const thrust = input.down.has('ArrowUp') || input.down.has('KeyW')
        if (thrust) {
          ship.vx += Math.cos(ship.a) * 260 * dt
          ship.vy += Math.sin(ship.a) * 260 * dt
        }
        ship.vx *= 1 - 0.6 * dt
        ship.vy *= 1 - 0.6 * dt
        ship.x += ship.vx * dt
        ship.y += ship.vy * dt
        wrap(ship)
        s.cooldown -= dt
        if (input.down.has('Space') && s.cooldown <= 0 && s.shots.length < 6) {
          s.cooldown = 0.18
          s.shots.push({ x: ship.x + Math.cos(ship.a) * 12, y: ship.y + Math.sin(ship.a) * 12, vx: Math.cos(ship.a) * 420 + ship.vx, vy: Math.sin(ship.a) * 420 + ship.vy, life: 0.9 })
        }
      } else if (s.phase === 'dead') {
        if (s.t > 1.5) {
          s.ship = { x: W / 2, y: H / 2, vx: 0, vy: 0, a: -Math.PI / 2 }
          s.phase = 'play'
        }
      }

      for (const r of s.rocks) {
        r.x += r.vx * dt
        r.y += r.vy * dt
        r.rot += r.spin * dt
        wrap(r)
      }
      for (const b of s.shots) {
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.life -= dt
        wrap(b)
      }
      s.shots = s.shots.filter((b) => b.life > 0)

      const born: Rock[] = []
      s.rocks = s.rocks.filter((r) => {
        const hit = s.shots.findIndex((b) => Math.hypot(b.x - r.x, b.y - r.y) < r.r)
        if (hit < 0) return true
        s.shots.splice(hit, 1)
        s.score += r.r >= 40 ? 20 : r.r >= 20 ? 50 : 100
        if (r.r > 12) born.push(rock(r.x, r.y, r.r / 2), rock(r.x, r.y, r.r / 2))
        return false
      })
      s.rocks.push(...born)
      if (!s.rocks.length) {
        s.wave++
        s.rocks = spawnWave(3 + s.wave)
      }

      if (s.phase === 'play' && s.rocks.some((r) => Math.hypot(r.x - ship.x, r.y - ship.y) < r.r + 8)) {
        s.lives--
        s.t = 0
        s.phase = s.lives <= 0 ? 'over' : 'dead'
      }
      st.current = s
      setHud((p) => (p.score === s.score && p.lives === s.lives ? p : { score: s.score, lives: s.lives }))

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      for (const r of s.rocks) {
        ctx.beginPath()
        r.shape.forEach((k, i) => {
          const a = r.rot + (i / r.shape.length) * TAU
          const px = r.x + Math.cos(a) * r.r * k
          const py = r.y + Math.sin(a) * r.r * k
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.closePath()
        ctx.stroke()
      }
      ctx.fillStyle = '#fff'
      for (const b of s.shots) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3)
      if (s.phase === 'play' || s.phase === 'ready') {
        ctx.save()
        ctx.translate(ship.x, ship.y)
        ctx.rotate(ship.a)
        ctx.beginPath()
        ctx.moveTo(14, 0)
        ctx.lineTo(-10, 9)
        ctx.lineTo(-6, 0)
        ctx.lineTo(-10, -9)
        ctx.closePath()
        ctx.stroke()
        if ((input.down.has('ArrowUp') || input.down.has('KeyW')) && s.phase === 'play' && Math.floor(s.t * 20) % 2 === 0) {
          ctx.beginPath()
          ctx.moveTo(-7, 4)
          ctx.lineTo(-16, 0)
          ctx.lineTo(-7, -4)
          ctx.stroke()
        }
        ctx.restore()
      }
      text(ctx, String(s.score).padStart(5, '0'), 10, 16, 14, '#fff', 'left')
      text(ctx, '▲ '.repeat(Math.max(0, s.lives)).trim(), W - 10, 16, 12, '#fff', 'right')
      if (s.phase === 'ready') {
        text(ctx, 'ASTEROIDS', W / 2, H / 2 - 40, 30)
        text(ctx, '←/→ rotate · ↑ thrust · Space fire', W / 2, H / 2 + 4, 12)
        text(ctx, 'PRESS SPACE TO START', W / 2, H / 2 + 34, 12)
      }
      if (s.phase === 'over') text(ctx, 'GAME OVER  —  SPACE TO RETRY', W / 2, H / 2, 16)
    },
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space', 'Enter'],
  )

  return (
    <>
      <div className="xp-menubar">
        <span
          onClick={() => {
            st.current = fresh()
            setHud({ score: 0, lives: 3 })
            canvas.current?.focus()
          }}
        >
          Game
        </span>
        <span>Help</span>
      </div>
      <div className="arcade">
        <canvas ref={canvas} width={W} height={H} tabIndex={0} onPointerDown={(e) => e.currentTarget.focus()} aria-label="Asteroids" />
        <div className="arcade-status">
          <span>Score {hud.score} · Ships {hud.lives}</span>
          <span>←/→ rotate · ↑ thrust · Space fire</span>
        </div>
      </div>
    </>
  )
}
