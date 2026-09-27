import { useEffect, useRef, type RefObject } from 'react'

export interface Input {
  down: Set<string>
  /** Keys pressed since the last frame; cleared by the loop. */
  pressed: Set<string>
}

/**
 * Runs a fixed-timestep canvas game loop while the component is mounted.
 * Keyboard state is tracked only while the canvas has focus, so multiple
 * game windows can be open without stealing each other's input.
 */
export function useArcade(
  canvas: RefObject<HTMLCanvasElement | null>,
  frame: (ctx: CanvasRenderingContext2D, dt: number, input: Input) => void,
  keys: string[],
) {
  const frameRef = useRef(frame)
  frameRef.current = frame

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return
    const input: Input = { down: new Set(), pressed: new Set() }
    const wanted = new Set(keys)
    const onDown = (e: KeyboardEvent) => {
      if (!wanted.has(e.code)) return
      e.preventDefault()
      if (!input.down.has(e.code)) input.pressed.add(e.code)
      input.down.add(e.code)
    }
    const onUp = (e: KeyboardEvent) => input.down.delete(e.code)
    const onBlur = () => input.down.clear()
    el.addEventListener('keydown', onDown)
    el.addEventListener('keyup', onUp)
    el.addEventListener('blur', onBlur)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      frameRef.current(ctx, dt, input)
      input.pressed.clear()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('keydown', onDown)
      el.removeEventListener('keyup', onUp)
      el.removeEventListener('blur', onBlur)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, size = 14, color = '#fff', align: CanvasTextAlign = 'center') {
  ctx.fillStyle = color
  ctx.font = `bold ${size}px "Courier New", monospace`
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.fillText(s, x, y)
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
