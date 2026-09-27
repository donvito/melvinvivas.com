import { useRef, useState } from 'react'
import { clamp, text, useArcade } from './arcade'

const T = 16
const W = 400
const H = 240
const GRAVITY = 1400
const JUMP = -430
const RUN = 120

// Legend: # ground  B brick  ? coin block  = platform  o coin  e enemy  | pipe  F flag  ^ spikes  ~ lava
const LEVELS: { name: string; sky: string; rows: string[] }[] = [
  {
    name: 'GREEN HILLS',
    sky: '#5c94fc',
    rows: [
      '                                                                                                               ',
      '                                                                                                               ',
      '                                                                                                               ',
      '                                                                                                               ',
      '                    ?                                                        BBB                               ',
      '                                                  B?B                                          F               ',
      '           o o                    o o                              o o o                       F               ',
      '         B?B?B      ==       e   B?B?B         o           ==                      e   BBBBB   F               ',
      '                                          ==          ==          ==     BBB                   F               ',
      '                  e         |        e              e                 e             |          F               ',
      '                            |        ===                              ===           |          F               ',
      '                 o o        |                            o o   |                     |         F               ',
      '      e         BBBBB       |         e         BBBBB    BBBBB  |     e      e       |     e   F               ',
      '####################################   #######################   ##############################################',
      '####################################   #######################   ##############################################',
    ],
  },
  {
    name: 'UNDERGROUND',
    sky: '#0a0a1a',
    rows: [
      '################################################################################################ ',
      '#                                                                                              # ',
      '#          o o o                          o o o                       o o o                    # ',
      '#         BBBBBBB                        BBBBBBB          =====      BBBBBBB                    #',
      '#                                                                                              # ',
      '#                     ==                             ==                          ==      F     # ',
      '#      o                          o    o                         o        o              F    #  ',
      '#     ===       e     BBB     e   ===  ===    e          BBB     ===     ===    e        F    #  ',
      '#                                                                                        F    #  ',
      '#                e            e                    e            e             e          F    #  ',
      '#    BB       BBBBBB       BBBBBB       BBBBBB          BBBBBB       BBBBBB        BBB   F    #  ',
      '#                                                                                        F    #  ',
      '#         ^^^        ^^^^         ^^^^       ^^^           ^^^^^         ^^^^^           F   #   ',
      '################################################################################################ ',
      '################################################################################################ ',
    ],
  },
  {
    name: 'SKY BRIDGES',
    sky: '#8fc8ff',
    rows: [
      '                                                                                                          ',
      '                                                                                                          ',
      '                 o o o                                  ? ?                                               ',
      '                =======                 o o            =====                 o o o                        ',
      '                                       =====                                =======               F       ',
      '        o o                e                        e                                  o          F       ',
      '       =====      o o    =====      o          =========        o o o     e          =====        F       ',
      '                 =====              ===                        =======  =====                     F       ',
      '   o                         o o            o                                        o o          F       ',
      '  ===       e     e         =====     e    ===      e      o o       e       e      =====   e     F       ',
      '=========  ==========  ==================  =========  ==============  ============  ==========  ==========',
      '                                                                                                          ',
      '                                                                                                          ',
      '                                                                                                          ',
      '                                                                                                          ',
    ],
  },
  {
    name: 'ICE CAVERNS',
    sky: '#0c1a3a',
    rows: [
      '########################################################################################################## ',
      '#                                                                                                        # ',
      '#        o o o                       o o o                      ? o ?                                    # ',
      '#       BBBBBBB          ==         BBBBBBB        ====        BBBBBBB          ====                     # ',
      '#                                                                                                        # ',
      '#          e           e                  e                e                   e                    F    # ',
      '#  ======     ==     =====     ==      ======      ==     =====      ==      =====     ==           F    # ',
      '#                                                                                                   F    # ',
      '#         o o            o          o o            o o             o o          o o                 F    # ',
      '#        =====    e     ===   e    =====    e     =====     e     =====   e    =====    e           F    # ',
      '#                                                                                                   F    # ',
      '#         e   e           e            e          e            e           e          e             F    # ',
      '#########  ###########  ############  ##########  #############  ##########  ############  ############### ',
      '#       ^^^         ^^^^            ^^^         ^^^            ^^^         ^^^^          ^^^              #',
      '########################################################################################################## ',
    ],
  },
  {
    name: 'FORTRESS',
    sky: '#1a1a24',
    rows: [
      '                                                                                                           ',
      '                                                                                                           ',
      '         ? ? ?                                 o o o                          ? ?                          ',
      '        BBBBBBB               ===             BBBBBBB          ===           BBBBB                         ',
      '                                                                                                    F      ',
      '    o           e           o o            e           o o           e                  o           F      ',
      '   ===       BBBBBB        =====        BBBBBB        =====       BBBBBBB      e      BBBBB         F      ',
      '                                                                            =====                   F      ',
      '        e            e                e                     e                          e    e       F      ',
      'BBBBBB   BBBBB   BBBBBBBB   BBBBB   BBBBBBB   BBBBB   BBBBBBBBB   BBBBB   BBBBBBB   BBBBBBBBBB      F      ',
      '                                                                                                    F      ',
      '      ^^^     ^^^        ^^^     ^^^       ^^^     ^^^         ^^^     ^^^       ^^^           ^^^  F      ',
      '######   #####   ########   #####   #######   #####   #########   #####   #######   ###########   ###      ',
      '######   #####   ########   #####   #######   #####   #########   #####   #######   ###########   #######  ',
      '###########################################################################################################',
    ],
  },
  {
    name: 'CASTLE',
    sky: '#2b0f0f',
    rows: [
      '                                                                                                  ',
      '                                                                                                  ',
      '                                                                                                  ',
      '          o o o             o o                o o o            o                           F     ',
      '         BBBBBBB          ======              BBBBBBB         =====         BBB             F     ',
      '                                                                                            F     ',
      '     o          e                    o                  o             e         o o         F     ',
      '    ===       ======      ===      =====      e       ====        ======      =====         F     ',
      '                                            ====                                            F     ',
      '        e          e             e                          e                     e         F     ',
      'BBBBB    BBB    BBBBBB    BBB    BBBBB    BBB     BBBB    BBBBBB     BBB    BBBBBB     BBBBBF     ',
      '                                                                                            F     ',
      '     ~~~~     ~~~~      ~~~~~~~~~~~~~~     ~~~~~~~     ~~~~~~~~~~~~     ~~~~~~~~~~~~~~     ~ ~    ',
      '#####    #####    ######              #####       #####            #####              #####   ####',
      '#####    #####    ######              #####       #####            #####              #####   ####',
    ],
  },
]

interface Enemy {
  x: number
  y: number
  vx: number
  alive: boolean
  squish: number
}
interface Level {
  grid: string[][]
  w: number
  h: number
  enemies: Enemy[]
  coins: Set<string>
  start: { x: number; y: number }
}
interface State {
  li: number
  lvl: Level
  x: number
  y: number
  vx: number
  vy: number
  onGround: boolean
  facing: 1 | -1
  coins: number
  score: number
  lives: number
  time: number
  camX: number
  phase: 'title' | 'play' | 'dead' | 'clear' | 'won' | 'over'
  t: number
  anim: number
}

function loadLevel(i: number): Level {
  const rows = LEVELS[i].rows
  const w = Math.max(...rows.map((r) => r.length))
  const grid = rows.map((r) => r.padEnd(w).split(''))
  const enemies: Enemy[] = []
  const coins = new Set<string>()
  grid.forEach((row, r) =>
    row.forEach((ch, c) => {
      if (ch === 'e') {
        enemies.push({ x: c * T, y: r * T, vx: -30, alive: true, squish: 0 })
        grid[r][c] = ' '
      } else if (ch === 'o') {
        coins.add(`${r},${c}`)
        grid[r][c] = ' '
      }
    }),
  )
  const floor = grid.findIndex((row, r) => r > 0 && SOLID.has(row[2]) && !SOLID.has(grid[r - 1][2]))
  return { grid, w, h: grid.length, enemies, coins, start: { x: 2 * T, y: ((floor < 0 ? grid.length - 3 : floor) - 1) * T } }
}

const SOLID = new Set(['#', 'B', '?', '=', '|', 'X'])
const solidAt = (l: Level, x: number, y: number) => {
  const c = Math.floor(x / T)
  const r = Math.floor(y / T)
  if (c < 0 || c >= l.w) return true
  if (r < 0) return false
  if (r >= l.h) return false
  return SOLID.has(l.grid[r][c])
}
const tileAt = (l: Level, x: number, y: number) => {
  const c = Math.floor(x / T)
  const r = Math.floor(y / T)
  return l.grid[r]?.[c] ?? ' '
}

const PW = 12
const PH = 14

function fresh(li = 0, keep?: Pick<State, 'coins' | 'score' | 'lives'>): State {
  const lvl = loadLevel(li)
  return {
    li,
    lvl,
    x: lvl.start.x,
    y: lvl.start.y,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    coins: keep?.coins ?? 0,
    score: keep?.score ?? 0,
    lives: keep?.lives ?? 3,
    time: 300,
    camX: 0,
    phase: li === 0 && !keep ? 'title' : 'play',
    t: 0,
    anim: 0,
  }
}

function drawTile(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, t: number) {
  switch (ch) {
    case '#':
      ctx.fillStyle = '#c84c0c'
      ctx.fillRect(x, y, T, T)
      ctx.fillStyle = '#f8b878'
      ctx.fillRect(x + 1, y + 1, 6, 6)
      ctx.fillRect(x + 9, y + 9, 6, 6)
      ctx.fillStyle = '#000'
      ctx.fillRect(x, y + 15, T, 1)
      ctx.fillRect(x + 15, y, 1, T)
      break
    case 'B':
      ctx.fillStyle = '#b8582c'
      ctx.fillRect(x, y, T, T)
      ctx.fillStyle = '#000'
      ctx.fillRect(x, y + 7, T, 1)
      ctx.fillRect(x, y + 15, T, 1)
      ctx.fillRect(x + 7, y, 1, 8)
      ctx.fillRect(x + 3, y + 8, 1, 8)
      ctx.fillRect(x + 11, y + 8, 1, 8)
      break
    case '?':
      ctx.fillStyle = '#f8a020'
      ctx.fillRect(x, y, T, T)
      ctx.fillStyle = '#000'
      ctx.strokeStyle = '#000'
      ctx.strokeRect(x + 0.5, y + 0.5, T - 1, T - 1)
      text(ctx, '?', x + T / 2, y + T / 2 + 1, 11, Math.floor(t * 4) % 2 ? '#000' : '#fff')
      break
    case 'X':
      ctx.fillStyle = '#8a6a3a'
      ctx.fillRect(x, y, T, T)
      ctx.strokeStyle = '#000'
      ctx.strokeRect(x + 0.5, y + 0.5, T - 1, T - 1)
      break
    case '=':
      ctx.fillStyle = '#30a020'
      ctx.fillRect(x, y, T, 6)
      ctx.fillStyle = '#c84c0c'
      ctx.fillRect(x, y + 6, T, T - 6)
      break
    case '|':
      ctx.fillStyle = '#20a020'
      ctx.fillRect(x + 1, y, T - 2, T)
      ctx.fillStyle = '#80f060'
      ctx.fillRect(x + 3, y, 3, T)
      break
    case 'F':
      ctx.fillStyle = '#ddd'
      ctx.fillRect(x + 7, y, 2, T)
      break
    case '^':
      ctx.fillStyle = '#ccc'
      for (let i = 0; i < 2; i++) {
        ctx.beginPath()
        ctx.moveTo(x + i * 8, y + T)
        ctx.lineTo(x + i * 8 + 4, y + 4)
        ctx.lineTo(x + i * 8 + 8, y + T)
        ctx.fill()
      }
      break
    case '~':
      ctx.fillStyle = '#e83c14'
      ctx.fillRect(x, y + 4, T, T - 4)
      ctx.fillStyle = '#ffb040'
      ctx.fillRect(x + ((Math.floor(t * 6) + x / T) % 3) * 5, y + 4, 4, 3)
      break
  }
}

function drawHero(ctx: CanvasRenderingContext2D, x: number, y: number, facing: 1 | -1, anim: number, moving: boolean, air: boolean) {
  ctx.save()
  ctx.translate(x + PW / 2, y)
  ctx.scale(facing, 1)
  const step = moving && !air ? Math.floor(anim * 10) % 2 : 0
  ctx.fillStyle = '#e03030' // cap + shirt
  ctx.fillRect(-6, 0, 12, 3)
  ctx.fillRect(-5, 7, 10, 3)
  ctx.fillStyle = '#f8c890' // face
  ctx.fillRect(-5, 3, 10, 4)
  ctx.fillStyle = '#000'
  ctx.fillRect(2, 4, 1, 1)
  ctx.fillStyle = '#2040c0' // overalls
  ctx.fillRect(-5, 10, 10, 2)
  ctx.fillRect(-5 + step * 2, 12, 4, 2)
  ctx.fillRect(1 - step * 2, 12, 4, 2)
  ctx.fillStyle = '#6a3a10' // shoes
  ctx.fillRect(-6 + step * 2, 13, 5, 1)
  ctx.fillRect(1 - step * 2, 13, 5, 1)
  ctx.restore()
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, t: number) {
  const h = e.squish > 0 ? 6 : T
  ctx.fillStyle = '#a05020'
  ctx.beginPath()
  ctx.ellipse(e.x + T / 2, e.y + T - h / 2, 7, h / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  if (e.squish <= 0) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(e.x + 4, e.y + 6, 3, 3)
    ctx.fillRect(e.x + 9, e.y + 6, 3, 3)
    ctx.fillStyle = '#000'
    ctx.fillRect(e.x + 5, e.y + 7, 1, 2)
    ctx.fillRect(e.x + 10, e.y + 7, 1, 2)
    const f = Math.floor(t * 6) % 2
    ctx.fillRect(e.x + 2 + f * 2, e.y + 14, 4, 2)
    ctx.fillRect(e.x + 10 - f * 2, e.y + 14, 4, 2)
  }
}

export function PlatformerApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const st = useRef<State>(fresh())
  const [hud, setHud] = useState({ coins: 0, lives: 3, score: 0, level: 1 })

  useArcade(
    canvas,
    (ctx, dt, input) => {
      let s = st.current
      s.t += dt
      const jumpKey = input.pressed.has('Space') || input.pressed.has('ArrowUp') || input.pressed.has('KeyW')
      const sync = () => setHud({ coins: s.coins, lives: s.lives, score: s.score, level: s.li + 1 })

      if (s.phase === 'title' && (jumpKey || input.pressed.has('Enter'))) s.phase = 'play'
      if (s.phase === 'title')
        for (let i = 0; i < LEVELS.length; i++)
          if (input.pressed.has(`Digit${i + 1}`)) {
            s = fresh(i, { coins: 0, score: 0, lives: 3 })
            sync()
          }
      if ((s.phase === 'over' || s.phase === 'won') && (jumpKey || input.pressed.has('Enter'))) {
        s = fresh()
        s.phase = 'play'
        sync()
      }
      if (s.phase === 'dead' && s.t > 1.5) {
        s = fresh(s.li, { coins: s.coins, score: s.score, lives: s.lives })
        sync()
      }
      if (s.phase === 'clear' && s.t > 2) {
        if (s.li + 1 >= LEVELS.length) s.phase = 'won'
        else {
          s = fresh(s.li + 1, { coins: s.coins, score: s.score, lives: s.lives })
          sync()
        }
      }

      const L = s.lvl
      if (s.phase === 'play') {
        s.time -= dt
        const left = input.down.has('ArrowLeft') || input.down.has('KeyA')
        const right = input.down.has('ArrowRight') || input.down.has('KeyD')
        const run = input.down.has('ShiftLeft') || input.down.has('ShiftRight') || input.down.has('KeyZ') || input.down.has('KeyX')
        const spd = run ? RUN * 1.6 : RUN
        const target = left ? -spd : right ? spd : 0
        s.vx += clamp(target - s.vx, -900 * dt, 900 * dt)
        if (left) s.facing = -1
        if (right) s.facing = 1
        if (jumpKey && s.onGround) s.vy = JUMP
        const holding = input.down.has('Space') || input.down.has('ArrowUp') || input.down.has('KeyW')
        s.vy += (holding && s.vy < 0 ? GRAVITY * 0.55 : GRAVITY) * dt
        s.vy = Math.min(s.vy, 500)
        if (Math.abs(s.vx) > 5) s.anim += dt

        // horizontal
        s.x += s.vx * dt
        if (s.vx > 0 && (solidAt(L, s.x + PW, s.y + 1) || solidAt(L, s.x + PW, s.y + PH - 1))) {
          s.x = Math.floor((s.x + PW) / T) * T - PW - 0.01
          s.vx = 0
        } else if (s.vx < 0 && (solidAt(L, s.x, s.y + 1) || solidAt(L, s.x, s.y + PH - 1))) {
          s.x = Math.floor(s.x / T + 1) * T + 0.01
          s.vx = 0
        }
        // vertical
        s.y += s.vy * dt
        s.onGround = false
        if (s.vy > 0 && (solidAt(L, s.x + 1, s.y + PH) || solidAt(L, s.x + PW - 1, s.y + PH))) {
          s.y = Math.floor((s.y + PH) / T) * T - PH
          s.vy = 0
          s.onGround = true
        } else if (s.vy < 0 && (solidAt(L, s.x + 1, s.y) || solidAt(L, s.x + PW - 1, s.y))) {
          const r = Math.floor(s.y / T)
          for (const px of [s.x + 1, s.x + PW - 1]) {
            const c = Math.floor(px / T)
            const ch = L.grid[r]?.[c]
            if (ch === '?') {
              L.grid[r][c] = 'X'
              s.coins++
              s.score += 200
              sync()
            } else if (ch === 'B') {
              L.grid[r][c] = ' '
              s.score += 50
            }
          }
          s.y = (r + 1) * T
          s.vy = 0
        }

        // coins
        for (const px of [s.x + 2, s.x + PW - 2])
          for (const py of [s.y + 2, s.y + PH - 2]) {
            const key = `${Math.floor(py / T)},${Math.floor(px / T)}`
            if (L.coins.has(key)) {
              L.coins.delete(key)
              s.coins++
              s.score += 100
              sync()
            }
          }

        // hazards
        const mid = tileAt(L, s.x + PW / 2, s.y + PH - 2)
        const die = () => {
          s.lives--
          s.t = 0
          s.vy = JUMP * 0.7
          s.phase = s.lives <= 0 ? 'over' : 'dead'
          sync()
        }
        if (mid === '^' || mid === '~' || s.y > L.h * T + 40 || s.time <= 0) die()
        if (mid === 'F' || tileAt(L, s.x + PW / 2, s.y + 2) === 'F') {
          s.phase = 'clear'
          s.t = 0
          s.score += Math.floor(s.time) * 10
          sync()
        }

        // enemies
        for (const e of L.enemies) {
          if (!e.alive) continue
          if (e.squish > 0) {
            e.squish -= dt
            if (e.squish <= 0) e.alive = false
            continue
          }
          e.x += e.vx * dt
          const ahead = e.vx < 0 ? e.x : e.x + T
          if (solidAt(L, ahead, e.y + T / 2) || !solidAt(L, ahead, e.y + T + 1)) {
            e.vx = -e.vx
            e.x += e.vx * dt * 2
          }
          const ox = s.x < e.x + T - 2 && s.x + PW > e.x + 2
          const oy = s.y < e.y + T && s.y + PH > e.y
          if (ox && oy && s.phase === 'play') {
            if (s.vy > 0 && s.y + PH - e.y < 9) {
              e.squish = 0.4
              s.vy = JUMP * 0.5
              s.score += 100
              sync()
            } else die()
          }
        }
      } else if (s.phase === 'dead') {
        s.vy += GRAVITY * dt
        s.y += s.vy * dt
      }

      s.camX = clamp(s.x - W / 3, 0, L.w * T - W)
      st.current = s

      // render
      ctx.fillStyle = LEVELS[s.li].sky
      ctx.fillRect(0, 0, W, H)
      if (LEVELS[s.li].name === 'SKY BRIDGES') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        for (let i = 0; i < 9; i++) {
          const cx = ((i * 130 - s.camX * 0.3) % (W + 120) + W + 120) % (W + 120) - 60
          const cy = 40 + ((i * 53) % 150)
          ctx.fillRect(cx, cy, 44, 10)
          ctx.fillRect(cx + 10, cy - 7, 22, 8)
        }
      }
      if (s.li === 0) {
        ctx.fillStyle = '#fff'
        for (let i = 0; i < 6; i++) {
          const cx = ((i * 160 - s.camX * 0.4) % (W + 100) + W + 100) % (W + 100) - 50
          ctx.fillRect(cx, 30 + (i % 3) * 25, 30, 8)
          ctx.fillRect(cx + 6, 24 + (i % 3) * 25, 18, 8)
        }
        ctx.fillStyle = '#20a020'
        for (let i = 0; i < 8; i++) {
          const cx = ((i * 200 - s.camX * 0.6) % (W + 200) + W + 200) % (W + 200) - 100
          ctx.beginPath()
          ctx.moveTo(cx, H - 32)
          ctx.lineTo(cx + 40, H - 80)
          ctx.lineTo(cx + 80, H - 32)
          ctx.fill()
        }
      }
      ctx.save()
      ctx.translate(-Math.floor(s.camX), 0)
      const c0 = Math.floor(s.camX / T)
      for (let r = 0; r < L.h; r++)
        for (let c = c0; c <= c0 + W / T + 1 && c < L.w; c++) {
          const ch = L.grid[r][c]
          if (ch !== ' ') drawTile(ctx, ch, c * T, r * T, s.t)
          if (ch === 'F' && (r === 0 || L.grid[r - 1][c] !== 'F')) {
            ctx.fillStyle = '#20c020'
            ctx.beginPath()
            ctx.moveTo(c * T + 7, r * T)
            ctx.lineTo(c * T - 6, r * T + 5)
            ctx.lineTo(c * T + 7, r * T + 10)
            ctx.fill()
          }
        }
      for (const key of L.coins) {
        const [r, c] = key.split(',').map(Number)
        const wob = Math.abs(Math.sin(s.t * 4 + c)) * 4 + 2
        ctx.fillStyle = '#f8d020'
        ctx.beginPath()
        ctx.ellipse(c * T + T / 2, r * T + T / 2, wob, 6, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const e of L.enemies) if (e.alive) drawEnemy(ctx, e, s.t)
      if (s.phase !== 'over' || s.t < 1.5) drawHero(ctx, s.x, s.y, s.facing, s.anim, Math.abs(s.vx) > 5, !s.onGround)
      ctx.restore()

      text(ctx, `SCORE ${String(s.score).padStart(6, '0')}`, 8, 12, 10, '#fff', 'left')
      text(ctx, `⨀×${s.coins}`, W / 2 - 60, 12, 10)
      text(ctx, `WORLD 1-${s.li + 1}`, W / 2 + 40, 12, 10)
      text(ctx, `TIME ${Math.max(0, Math.ceil(s.time))}`, W - 8, 12, 10, '#fff', 'right')

      if (s.phase === 'title') {
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(40, 60, W - 80, 120)
        text(ctx, 'SUPER MELVIN BROS', W / 2, 90, 20, '#f8d020')
        text(ctx, '←/→ move · Z/Shift run · Space jump', W / 2, 125, 11)
        text(ctx, 'PRESS SPACE TO START', W / 2, 155, 11, Math.floor(s.t * 2) % 2 ? '#fff' : '#aaa')
        text(ctx, `1-${LEVELS.length} warp to stage`, W / 2, 172, 9, '#888')
      }
      if (s.phase === 'clear') text(ctx, `${LEVELS[s.li].name} CLEAR!`, W / 2, H / 2, 20, '#f8d020')
      if (s.phase === 'won') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, W, H)
        text(ctx, 'THANK YOU MELVIN!', W / 2, H / 2 - 20, 20, '#f8d020')
        text(ctx, `FINAL SCORE ${s.score}`, W / 2, H / 2 + 12, 12)
        text(ctx, 'SPACE TO PLAY AGAIN', W / 2, H / 2 + 40, 11)
      }
      if (s.phase === 'over') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, W, H)
        text(ctx, 'GAME OVER', W / 2, H / 2 - 10, 24)
        text(ctx, 'SPACE TO RETRY', W / 2, H / 2 + 24, 11)
      }
    },
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyX', 'KeyZ', 'ShiftLeft', 'ShiftRight', 'Space', 'Enter', ...LEVELS.map((_, i) => `Digit${i + 1}`)],
  )

  return (
    <>
      <div className="xp-menubar">
        <span
          onClick={() => {
            st.current = fresh()
            setHud({ coins: 0, lives: 3, score: 0, level: 1 })
            canvas.current?.focus()
          }}
        >
          Game
        </span>
        <span>Help</span>
      </div>
      <div className="arcade">
        <canvas ref={canvas} width={W} height={H} tabIndex={0} onPointerDown={(e) => e.currentTarget.focus()} aria-label="Super Melvin Bros" className="pixel" style={{ width: W * 1.5, height: H * 1.5 }} />
        <div className="arcade-status">
          <span>World 1-{hud.level} · Lives {hud.lives} · Coins {hud.coins}</span>
          <span>←/→ · Shift run · Space jump</span>
        </div>
      </div>
    </>
  )
}
