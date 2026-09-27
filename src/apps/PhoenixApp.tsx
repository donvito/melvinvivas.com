import { useRef, useState } from 'react'
import { clamp, text, useArcade } from './arcade'

const W = 400
const H = 480
const SHIP_Y = H - 40
const SHIP_W = 24

type BirdKind = 'small' | 'large' | 'boss'
interface Bird {
  kind: BirdKind
  x: number
  y: number
  hx: number
  hy: number
  hp: number
  dive: number
  phase: number
  flap: number
  bomb: number
  wingL: boolean
  wingR: boolean
}
interface Shot {
  x: number
  y: number
  vy: number
  vx: number
  hostile: boolean
}
interface Boom {
  x: number
  y: number
  t: number
  c: string
}
interface State {
  x: number
  vx: number
  birds: Bird[]
  shots: Shot[]
  booms: Boom[]
  score: number
  lives: number
  wave: number
  loop: number
  shield: number
  cooldown: number
  phase: 'title' | 'play' | 'dead' | 'wave' | 'over' | 'won'
  t: number
  cannon: number
  mother: number[][] | null
}

const WAVE_NAMES = ['SPARROWS', 'SWIFTS', 'PHOENIX', 'PHOENIX RISING', 'MOTHERSHIP']

function spawnWave(w: number, loop: number): { birds: Bird[]; mother: number[][] | null } {
  const birds: Bird[] = []
  const k = w % 5
  if (k <= 1) {
    const cols = 8
    const rows = k === 0 ? 2 : 3
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const hx = 40 + c * ((W - 80) / (cols - 1))
        const hy = 60 + r * 30
        birds.push({ kind: 'small', x: hx, y: -40 - r * 40, hx, hy, hp: 1, dive: 0, phase: Math.random() * 6, flap: Math.random(), bomb: 2 + Math.random() * 4, wingL: true, wingR: true })
      }
  } else if (k <= 3) {
    const n = k === 2 ? 4 : 6
    for (let i = 0; i < n; i++) {
      const hx = 60 + (i % 3) * ((W - 120) / 2)
      const hy = 70 + Math.floor(i / 3) * 70
      birds.push({ kind: 'large', x: hx, y: -60 - i * 30, hx, hy, hp: 3, dive: 0, phase: Math.random() * 6, flap: Math.random(), bomb: 3 + Math.random() * 3, wingL: true, wingR: true })
    }
  } else {
    // 14 x 6 hull; 2 = armor, 1 = plating, 0 = hole, 9 = alien core cell
    const mother: number[][] = []
    for (let r = 0; r < 6; r++) {
      const row: number[] = []
      for (let c = 0; c < 14; c++) row.push(r >= 4 ? 2 : r === 3 ? 1 : 0)
      mother.push(row)
    }
    for (let c = 5; c < 9; c++) mother[1][c] = 9
    for (let i = 0; i < 6; i++) {
      const hx = 30 + i * ((W - 60) / 5)
      birds.push({ kind: 'small', x: hx, y: -30, hx, hy: 200, hp: 1, dive: 0, phase: i, flap: 0, bomb: 4 + i, wingL: true, wingR: true })
    }
    return { birds, mother }
  }
  for (const b of birds) b.bomb /= 1 + loop * 0.3
  return { birds, mother: null }
}

function fresh(): State {
  const { birds, mother } = spawnWave(0, 0)
  return { x: W / 2, vx: 0, birds, shots: [], booms: [], score: 0, lives: 3, wave: 0, loop: 0, shield: 0, cooldown: 0, phase: 'title', t: 0, cannon: 0, mother }
}

function nextWave(s: State): State {
  const wave = s.wave + 1
  const loop = Math.floor(wave / 5)
  const { birds, mother } = spawnWave(wave, loop)
  return { ...s, wave, loop, birds, mother, shots: [], phase: 'wave', t: 0, x: W / 2, vx: 0 }
}

const MOTHER_X = (W - 14 * 20) / 2
const motherY = (t: number) => 60 + Math.min(120, t * 8)

function drawBird(ctx: CanvasRenderingContext2D, b: Bird, t: number) {
  const big = b.kind === 'large'
  const s = big ? 1.8 : 1
  const flap = Math.sin(t * 8 + b.flap * 6) * 6 * s
  ctx.save()
  ctx.translate(b.x, b.y)
  ctx.fillStyle = big ? (b.hp === 3 ? '#ff5050' : b.hp === 2 ? '#ffa030' : '#ffe060') : '#60e0ff'
  // body
  ctx.beginPath()
  ctx.ellipse(0, 0, 5 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // wings
  ctx.fillStyle = big ? '#ff9040' : '#30a0ff'
  if (b.wingL) {
    ctx.beginPath()
    ctx.moveTo(-3 * s, 0)
    ctx.lineTo(-16 * s, -flap)
    ctx.lineTo(-14 * s, 6 * s - flap / 2)
    ctx.closePath()
    ctx.fill()
  }
  if (b.wingR) {
    ctx.beginPath()
    ctx.moveTo(3 * s, 0)
    ctx.lineTo(16 * s, -flap)
    ctx.lineTo(14 * s, 6 * s - flap / 2)
    ctx.closePath()
    ctx.fill()
  }
  ctx.fillStyle = '#fff'
  ctx.fillRect(-2 * s, -4 * s, 1.5 * s, 1.5 * s)
  ctx.fillRect(1 * s, -4 * s, 1.5 * s, 1.5 * s)
  ctx.restore()
}

export function PhoenixApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const st = useRef<State>(fresh())
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1 })

  useArcade(
    canvas,
    (ctx, dt, input) => {
      let s = st.current
      s.t += dt
      const fire = input.pressed.has('Space')

      if (s.phase === 'title' && (fire || input.pressed.has('Enter'))) {
        s.phase = 'wave'
        s.t = 0
      }
      if (s.phase === 'over' && (fire || input.pressed.has('Enter'))) {
        s = fresh()
        s.phase = 'wave'
      }
      if (s.phase === 'won' && s.t > 3) s = nextWave(s)
      if (s.phase === 'wave' && s.t > 1.5) s.phase = 'play'
      if (s.phase === 'dead' && s.t > 1.5) {
        s.phase = 'play'
        s.x = W / 2
        s.shots = s.shots.filter((sh) => !sh.hostile)
      }

      const alive = s.phase === 'play'
      if (alive || s.phase === 'wave') {
        // player
        const left = input.down.has('ArrowLeft') || input.down.has('KeyA')
        const right = input.down.has('ArrowRight') || input.down.has('KeyD')
        const shieldKey = input.down.has('ArrowDown') || input.down.has('KeyS') || input.down.has('ShiftLeft') || input.down.has('ShiftRight')
        s.cooldown = Math.max(0, s.cooldown - dt)
        if (shieldKey && s.cooldown <= 0 && s.shield <= 0 && alive) {
          s.shield = 1.5
          s.cooldown = 4
        }
        if (s.shield > 0) s.shield -= dt
        else {
          s.vx = left ? -220 : right ? 220 : 0
          s.x = clamp(s.x + s.vx * dt, SHIP_W / 2 + 4, W - SHIP_W / 2 - 4)
        }
        s.cannon = Math.max(0, s.cannon - dt)
        if (fire && alive && s.shield <= 0 && s.cannon <= 0 && !s.shots.some((sh) => !sh.hostile)) {
          s.shots.push({ x: s.x, y: SHIP_Y - 14, vy: -520, vx: 0, hostile: false })
          s.cannon = 0.12
        }
      }

      const speed = 1 + s.loop * 0.25
      if (alive) {
        // birds
        for (const b of s.birds) {
          b.phase += dt
          if (s.mother) {
            b.x = b.hx + Math.sin(s.t * 1.2 + b.phase) * 60
            b.y = motherY(s.t) + 150 + Math.sin(s.t * 2 + b.phase) * 10
          } else if (b.dive > 0) {
            b.dive += dt
            b.y += (b.kind === 'large' ? 150 : 210) * speed * dt
            b.x += Math.sin(b.dive * 4) * 120 * dt + (s.x - b.x) * 0.6 * dt
            if (b.y > H + 30) {
              b.dive = 0
              b.y = -30
              b.x = b.hx
            }
          } else {
            const tx = b.hx + Math.sin(s.t * 1.5 + b.phase) * 30
            const ty = b.hy + Math.sin(s.t * 2.5 + b.phase * 2) * 8
            b.x += (tx - b.x) * 3 * dt
            b.y += (ty - b.y) * 3 * dt
            if (Math.random() < (0.08 + s.wave * 0.02) * speed * dt && b.y > 40) b.dive = 0.001
          }
          b.bomb -= dt
          if (b.bomb <= 0 && b.y > 0 && b.y < SHIP_Y - 60) {
            b.bomb = (b.kind === 'large' ? 2.5 : 4) / speed + Math.random() * 2
            s.shots.push({ x: b.x, y: b.y + 10, vy: 200 * speed, vx: b.dive > 0 ? 0 : (s.x - b.x) * 0.3, hostile: true })
          }
        }
        // mothership
        if (s.mother) {
          const my = motherY(s.t)
          if (Math.random() < 1.2 * dt) {
            const c = Math.floor(Math.random() * 14)
            s.shots.push({ x: MOTHER_X + c * 20 + 10, y: my + 6 * 20, vy: 230 * speed, vx: 0, hostile: true })
          }
          if (my + 6 * 20 > SHIP_Y - 20) {
            s.lives = 0
            s.phase = 'over'
            s.t = 0
          }
        }

        // shots
        for (const sh of s.shots) {
          sh.y += sh.vy * dt
          sh.x += sh.vx * dt
        }
        s.shots = s.shots.filter((sh) => sh.y > -20 && sh.y < H + 20)

        // hits
        for (const sh of s.shots) {
          if (sh.hostile) continue
          let hit = false
          for (const b of s.birds) {
            const big = b.kind === 'large'
            const half = big ? 26 : 14
            if (Math.abs(sh.x - b.x) < half && Math.abs(sh.y - b.y) < (big ? 14 : 9)) {
              if (big && Math.abs(sh.x - b.x) > 8) {
                const leftWing = sh.x < b.x
                if (!(leftWing ? b.wingL : b.wingR)) continue
                if (leftWing) b.wingL = false
                else b.wingR = false
                s.score += 20
                s.booms.push({ x: sh.x, y: sh.y, t: 0.3, c: '#ff9040' })
                hit = true
                break
              }
              hit = true
              b.hp--
              if (b.hp <= 0) {
                s.score += big ? 200 : b.dive > 0 ? 80 : 40
                s.booms.push({ x: b.x, y: b.y, t: 0.5, c: big ? '#ffe060' : '#60e0ff' })
              } else s.score += 10
              break
            }
          }
          if (!hit && s.mother) {
            const my = motherY(s.t)
            const c = Math.floor((sh.x - MOTHER_X) / 20)
            const r = Math.floor((sh.y - my) / 20)
            if (c >= 0 && c < 14 && r >= 0 && r < 6 && s.mother[r][c] !== 0) {
              const cell = s.mother[r][c]
              hit = true
              if (cell === 9) {
                s.score += 2000 + s.loop * 500
                s.booms.push({ x: MOTHER_X + 7 * 20, y: my + 30, t: 1.2, c: '#ff40ff' })
                s.phase = 'won'
                s.t = 0
              } else {
                s.mother[r][c] = cell === 2 ? 1 : 0
                s.score += cell === 2 ? 5 : 10
                s.booms.push({ x: sh.x, y: sh.y, t: 0.25, c: '#aaa' })
              }
            }
          }
          if (hit) sh.y = -999
        }
        s.birds = s.birds.filter((b) => b.hp > 0)
        s.shots = s.shots.filter((sh) => sh.y > -100)
        if (s.mother) {
          // holes in the hull regenerate slowly
          if (Math.random() < 0.6 * dt) {
            const r = 3 + Math.floor(Math.random() * 3)
            const c = Math.floor(Math.random() * 14)
            if (s.mother[r][c] === 0) s.mother[r][c] = 1
          }
        }

        // player hit
        if (s.phase === 'play' && s.shield <= 0) {
          const die = () => {
            s.lives--
            s.booms.push({ x: s.x, y: SHIP_Y, t: 0.8, c: '#fff' })
            s.t = 0
            s.phase = s.lives <= 0 ? 'over' : 'dead'
          }
          for (const sh of s.shots)
            if (sh.hostile && Math.abs(sh.x - s.x) < SHIP_W / 2 && Math.abs(sh.y - SHIP_Y) < 10) {
              sh.y = -999
              die()
              break
            }
          if (s.phase === 'play')
            for (const b of s.birds)
              if (Math.abs(b.x - s.x) < SHIP_W / 2 + 8 && Math.abs(b.y - SHIP_Y) < 14) {
                b.hp = 0
                die()
                break
              }
          s.birds = s.birds.filter((b) => b.hp > 0)
        }
        if (s.phase === 'play' && s.birds.length === 0 && !s.mother) {
          s.score += 100 * (s.wave + 1)
          s = nextWave(s)
        }
      }
      for (const b of s.booms) b.t -= dt
      s.booms = s.booms.filter((b) => b.t > 0)

      st.current = s
      setHud((p) => (p.score === s.score && p.lives === s.lives && p.wave === s.wave + 1 ? p : { score: s.score, lives: s.lives, wave: s.wave + 1 }))

      // render
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#446'
      for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % W, ((i * 53 + s.t * 30 * (1 + (i % 3))) % H), 1, 1)

      if (s.mother) {
        const my = motherY(s.t)
        for (let r = 0; r < 6; r++)
          for (let c = 0; c < 14; c++) {
            const cell = s.mother[r][c]
            const x = MOTHER_X + c * 20
            const y = my + r * 20
            if (cell === 9) {
              ctx.fillStyle = Math.floor(s.t * 4) % 2 ? '#ff40ff' : '#a020a0'
              ctx.fillRect(x + 2, y + 2, 16, 16)
            } else if (cell === 2) {
              ctx.fillStyle = '#8c8ca0'
              ctx.fillRect(x, y, 20, 20)
              ctx.strokeStyle = '#333'
              ctx.strokeRect(x + 0.5, y + 0.5, 19, 19)
            } else if (cell === 1) {
              ctx.fillStyle = '#50506a'
              ctx.fillRect(x + 1, y + 1, 18, 18)
            } else if (r <= 2) {
              ctx.fillStyle = '#20203a'
              ctx.fillRect(x, y, 20, 20)
            }
          }
        ctx.fillStyle = '#20203a'
        ctx.fillRect(MOTHER_X - 20, my + 30, 20, 60)
        ctx.fillRect(MOTHER_X + 14 * 20, my + 30, 20, 60)
      }

      for (const b of s.birds) drawBird(ctx, b, s.t)
      for (const sh of s.shots) {
        ctx.fillStyle = sh.hostile ? '#ff5050' : '#ffff80'
        ctx.fillRect(sh.x - 1.5, sh.y - 6, 3, 12)
      }
      for (const b of s.booms) {
        ctx.strokeStyle = b.c
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(b.x, b.y, (1 - b.t / 0.5) * 22 + 4, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (s.phase === 'play' || s.phase === 'wave' || s.phase === 'title') {
        ctx.fillStyle = '#e0e0ff'
        ctx.beginPath()
        ctx.moveTo(s.x, SHIP_Y - 14)
        ctx.lineTo(s.x + SHIP_W / 2, SHIP_Y + 8)
        ctx.lineTo(s.x + 6, SHIP_Y + 4)
        ctx.lineTo(s.x - 6, SHIP_Y + 4)
        ctx.lineTo(s.x - SHIP_W / 2, SHIP_Y + 8)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#40c0ff'
        ctx.fillRect(s.x - 2, SHIP_Y - 8, 4, 8)
        if (s.shield > 0) {
          ctx.strokeStyle = `rgba(80,200,255,${0.5 + Math.sin(s.t * 20) * 0.3})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(s.x, SHIP_Y, 22, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.fillStyle = '#446'
      ctx.fillRect(0, H - 6, W, 6)

      text(ctx, String(s.score).padStart(6, '0'), 8, 14, 12, '#fff', 'left')
      text(ctx, `WAVE ${s.wave + 1}`, W / 2, 14, 12, '#ffe060')
      text(ctx, '▲ '.repeat(Math.max(0, s.lives)).trim(), W - 8, 14, 11, '#fff', 'right')
      if (s.cooldown > 0 && s.shield <= 0) text(ctx, `SHIELD ${Math.ceil(s.cooldown)}`, W - 8, H - 16, 9, '#888', 'right')
      else text(ctx, 'SHIELD READY', W - 8, H - 16, 9, '#40c0ff', 'right')

      if (s.phase === 'title') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(30, 120, W - 60, 180)
        text(ctx, 'PHOENIX', W / 2, 160, 34, '#ff9040')
        text(ctx, 'Shoot the alien birds. Clip the', W / 2, 200, 11)
        text(ctx, 'big ones\u2019 wings. Reach the mothership!', W / 2, 216, 11)
        text(ctx, '←/→ move · Space fire · ↓ shield', W / 2, 246, 11, '#aaa')
        text(ctx, 'PRESS SPACE TO START', W / 2, 278, 12, Math.floor(s.t * 2) % 2 ? '#fff' : '#888')
      }
      if (s.phase === 'wave') text(ctx, `WAVE ${s.wave + 1} · ${WAVE_NAMES[s.wave % 5]}`, W / 2, H / 2, 18, '#ffe060')
      if (s.phase === 'over') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, W, H)
        text(ctx, 'GAME OVER', W / 2, H / 2 - 12, 26)
        text(ctx, 'SPACE TO RETRY', W / 2, H / 2 + 24, 12)
      }
      if (s.phase === 'won') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, W, H)
        text(ctx, 'MOTHERSHIP DESTROYED!', W / 2, H / 2 - 12, 22, '#ff40ff')
        text(ctx, `SCORE ${s.score}`, W / 2, H / 2 + 20, 14)
        text(ctx, `LOOP ${s.loop + 2} INCOMING…`, W / 2, H / 2 + 46, 12, '#aaa')
      }
    },
    ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'KeyA', 'KeyD', 'KeyS', 'ShiftLeft', 'ShiftRight', 'Space', 'Enter'],
  )

  return (
    <>
      <div className="xp-menubar">
        <span
          onClick={() => {
            st.current = fresh()
            setHud({ score: 0, lives: 3, wave: 1 })
            canvas.current?.focus()
          }}
        >
          Game
        </span>
        <span>Help</span>
      </div>
      <div className="arcade">
        <canvas ref={canvas} width={W} height={H} tabIndex={0} onPointerDown={(e) => e.currentTarget.focus()} aria-label="Phoenix" />
        <div className="arcade-status">
          <span>Score {hud.score} · Ships {hud.lives} · Wave {hud.wave}</span>
          <span>←/→ move · Space fire · ↓ shield</span>
        </div>
      </div>
    </>
  )
}
