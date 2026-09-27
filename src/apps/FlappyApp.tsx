import { useEffect, useRef, useState } from 'react'

const W = 288
const H = 400
const GROUND = 56
const BIRD_R = 12
const GRAVITY = 1300
const FLAP = -380
const PIPE_W = 52
const GAP = 110
const PIPE_SPACING = 170
const SPEED = 120
const BEST_KEY = 'xp:flappy-best'

interface Pipe {
  x: number
  top: number
  passed: boolean
}

type Phase = 'ready' | 'playing' | 'dead'

interface Game {
  phase: Phase
  y: number
  vy: number
  pipes: Pipe[]
  score: number
  t: number
  groundX: number
}

function newGame(): Game {
  return { phase: 'ready', y: H / 2 - 30, vy: 0, pipes: [], score: 0, t: 0, groundX: 0 }
}

function spawnPipe(x: number): Pipe {
  const margin = 40
  const top = margin + Math.random() * (H - GROUND - GAP - margin * 2)
  return { x, top, passed: false }
}

function update(g: Game, dt: number): Game {
  if (g.phase !== 'playing') return { ...g, t: g.t + dt, groundX: (g.groundX + SPEED * dt) % 24 }
  const vy = g.vy + GRAVITY * dt
  const y = g.y + vy * dt
  let pipes = g.pipes.map((p) => ({ ...p, x: p.x - SPEED * dt })).filter((p) => p.x + PIPE_W > -10)
  const last = pipes[pipes.length - 1]
  if (!last || last.x < W - PIPE_SPACING) pipes.push(spawnPipe(last ? last.x + PIPE_SPACING : W + 40))

  let score = g.score
  pipes = pipes.map((p) => {
    if (!p.passed && p.x + PIPE_W < W / 3) {
      score++
      return { ...p, passed: true }
    }
    return p
  })

  const bx = W / 3
  const hitGround = y + BIRD_R >= H - GROUND
  const hitCeil = y - BIRD_R <= 0
  const hitPipe = pipes.some((p) => {
    const inX = bx + BIRD_R - 3 > p.x && bx - BIRD_R + 3 < p.x + PIPE_W
    return inX && (y - BIRD_R + 3 < p.top || y + BIRD_R - 3 > p.top + GAP)
  })
  const phase: Phase = hitGround || hitCeil || hitPipe ? 'dead' : 'playing'
  return { ...g, phase, y: hitGround ? H - GROUND - BIRD_R : y, vy, pipes, score, t: g.t + dt, groundX: (g.groundX + SPEED * dt) % 24 }
}

function draw(ctx: CanvasRenderingContext2D, g: Game, best: number) {
  ctx.fillStyle = '#70c5ce'
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 90 - (g.t * 15) % 360) + 360) % 360 - 30
    ctx.beginPath()
    ctx.arc(cx, 70 + (i % 2) * 40, 16, 0, Math.PI * 2)
    ctx.arc(cx + 18, 64 + (i % 2) * 40, 20, 0, Math.PI * 2)
    ctx.arc(cx + 38, 72 + (i % 2) * 40, 14, 0, Math.PI * 2)
    ctx.fill()
  }

  for (const p of g.pipes) {
    for (const [py, ph] of [
      [0, p.top],
      [p.top + GAP, H - GROUND - p.top - GAP],
    ] as const) {
      ctx.fillStyle = '#73bf2e'
      ctx.fillRect(p.x, py, PIPE_W, ph)
      ctx.fillStyle = '#9ae04d'
      ctx.fillRect(p.x + 4, py, 8, ph)
      ctx.strokeStyle = '#4e7d1e'
      ctx.lineWidth = 2
      ctx.strokeRect(p.x, py, PIPE_W, ph)
      const capY = py === 0 ? ph - 22 : py
      ctx.fillStyle = '#73bf2e'
      ctx.fillRect(p.x - 3, capY, PIPE_W + 6, 22)
      ctx.strokeRect(p.x - 3, capY, PIPE_W + 6, 22)
    }
  }

  ctx.fillStyle = '#ded895'
  ctx.fillRect(0, H - GROUND, W, GROUND)
  ctx.fillStyle = '#73bf2e'
  ctx.fillRect(0, H - GROUND, W, 10)
  ctx.fillStyle = '#5a9e22'
  for (let x = -g.groundX; x < W; x += 24) ctx.fillRect(x, H - GROUND, 12, 10)
  ctx.fillStyle = '#4e7d1e'
  ctx.fillRect(0, H - GROUND + 10, W, 2)

  const bx = W / 3
  const angle = g.phase === 'ready' ? 0 : Math.max(-0.5, Math.min(1.2, g.vy / 500))
  ctx.save()
  ctx.translate(bx, g.y)
  ctx.rotate(angle)
  ctx.fillStyle = '#f8d64e'
  ctx.strokeStyle = '#7a5a12'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(0, 0, BIRD_R + 2, BIRD_R, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.ellipse(-5, 2, 6, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(6, -3, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.arc(7.5, -3, 1.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f0742c'
  ctx.beginPath()
  ctx.moveTo(8, 2)
  ctx.lineTo(18, 4)
  ctx.lineTo(8, 7)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  ctx.textAlign = 'center'
  ctx.lineWidth = 4
  ctx.strokeStyle = '#333'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 36px Tahoma, Verdana, sans-serif'
  if (g.phase === 'playing') {
    ctx.strokeText(String(g.score), W / 2, 60)
    ctx.fillText(String(g.score), W / 2, 60)
  }
  if (g.phase === 'ready') {
    ctx.font = 'bold 26px Tahoma, Verdana, sans-serif'
    ctx.strokeText('Flappy Bird', W / 2, 120)
    ctx.fillText('Flappy Bird', W / 2, 120)
    ctx.font = 'bold 14px Tahoma, Verdana, sans-serif'
    ctx.lineWidth = 3
    ctx.strokeText('Click, tap or press Space to flap', W / 2, 260)
    ctx.fillText('Click, tap or press Space to flap', W / 2, 260)
    if (best) {
      ctx.strokeText(`Best: ${best}`, W / 2, 285)
      ctx.fillText(`Best: ${best}`, W / 2, 285)
    }
  }
  if (g.phase === 'dead') {
    ctx.fillStyle = '#ded895'
    ctx.strokeStyle = '#7a5a12'
    ctx.lineWidth = 3
    ctx.fillRect(44, 120, 200, 130)
    ctx.strokeRect(44, 120, 200, 130)
    ctx.fillStyle = '#7a5a12'
    ctx.font = 'bold 22px Tahoma, Verdana, sans-serif'
    ctx.fillText('Game Over', W / 2, 152)
    ctx.font = 'bold 15px Tahoma, Verdana, sans-serif'
    ctx.fillText(`Score  ${g.score}`, W / 2, 185)
    ctx.fillText(`Best   ${best}`, W / 2, 208)
    ctx.font = '12px Tahoma, Verdana, sans-serif'
    ctx.fillText('Click or press Space to retry', W / 2, 236)
  }
}

export function FlappyApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const game = useRef<Game>(newGame())
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY)) || 0)
  const bestRef = useRef(best)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const prev = game.current
      const g = update(prev, dt)
      game.current = g
      if (g.score !== prev.score) setScore(g.score)
      if (g.phase === 'dead' && prev.phase === 'playing' && g.score > bestRef.current) {
        bestRef.current = g.score
        localStorage.setItem(BEST_KEY, String(g.score))
        setBest(g.score)
      }
      draw(ctx, g, bestRef.current)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const flap = () => {
    const g = game.current
    if (g.phase === 'dead') {
      game.current = newGame()
      setScore(0)
      return
    }
    game.current = { ...g, phase: 'playing', vy: FLAP, pipes: g.phase === 'ready' ? [spawnPipe(W + 40)] : g.pipes }
  }

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        flap()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="xp-menubar">
        <span
          onClick={() => {
            game.current = newGame()
            setScore(0)
          }}
        >
          Game
        </span>
        <span>Help</span>
      </div>
      <div className="flappy">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          tabIndex={0}
          onPointerDown={(e) => {
            e.currentTarget.focus()
            flap()
          }}
          aria-label="Flappy Bird game"
        />
        <div className="flappy-status">
          <span>Score: {score}</span>
          <span>Best: {best}</span>
        </div>
      </div>
    </>
  )
}
