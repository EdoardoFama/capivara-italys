// Pixel art helpers. Sprites are either string grids (createTexture)
// or procedurally drawn (pizza layers / toppings) for crisp round shapes.

type RGBA = [number, number, number, number]

const PALETTE: Record<string, RGBA> = {
  '_': [0,   0,   0,   0  ], // transparent
  'E': [45,  26,  15,  255], // outline
  'B': [105, 64,  36,  255], // dark brown
  'b': [142, 92,  54,  255], // medium brown
  'h': [180, 128, 84,  255], // light brown (highlight)
  'l': [205, 158, 112, 255], // muzzle / cheeks
  'n': [78,  46,  24,  255], // deep shadow
  'z': [28,  18,  12,  255], // eye
  'e': [255, 255, 255, 255], // eye glint
  'p': [70,  40,  22,  255], // nostril
  'W': [246, 246, 242, 255], // hat white
  'G': [214, 214, 206, 255], // hat shadow
  'A': [248, 244, 226, 255], // apron
  'a': [225, 218, 192, 255], // apron shadow
  'H': [200, 60,  50,  255], // apron collar (red)
  'k': [120, 110, 100, 255], // oven metal dark
  'w': [190, 180, 168, 255], // oven metal light
  'F': [250, 220, 90,  255], // oven fire
  'f': [240, 150, 40,  255], // oven fire dark
}

// ── Capivara chef (front view), ~31x40 ────────────────────────────────
export const CAPIVARA = [
  '___________EEEEEEEEEE___________',
  '________EEEWWWWWWWWWWEEE________',
  '______EEWWWWWWWWWWWWWWWWEE______',
  '_____EWWWWWWWWWWWWWWWWWWWWE_____',
  '____EWWWWWWWWWWWWWWWWWWWWWWE____',
  '____EWWWWWWWGGGGGGGGWWWWWWWE____',
  '____EEEEEEEEEEEEEEEEEEEEEEEE____',
  '____EWWWWWWWWWWWWWWWWWWWWWWE____',
  '____EEEEEEEEEEEEEEEEEEEEEEEE____',
  '______EbbE__________EbbE_______',
  '_____EBBBBBBBBBBBBBBBBBBBBE_____',
  '____EBhhhhhhhhhhhhhhhhhhhhBE____',
  '___EBhhhbbbbbbbbbbbbbbbbhhhBE___',
  '__EBhhbbbbbbbbbbbbbbbbbbbbhhBE__',
  '__EBhbbbbbbbbbbbbbbbbbbbbbbhBE__',
  '__EBhbbbzzzzbbbbbbbbzzzzbbbhBE__',
  '__EBhbbbzezzbbbbbbbbzezzbbbhBE__',
  '__EBhbbbzzzzbbbbbbbbzzzzbbbhBE__',
  '__EBhbbbbbbbbbbbbbbbbbbbbbbhBE__',
  '__EBhbbbblllllllllllllllbbbhBE__',
  '__EBbbbblllllllllllllllllbbbBE__',
  '__EBbbblllllppllllppllllbbbBE___',
  '__EBbbblllllllllllllllllbbbBE___',
  '__EBbbbbllllllllllllllllbbbbBE__',
  '___EBbbbbllllllllllllllbbbbBE___',
  '___EBBbbbbbbbbbbbbbbbbbbbbBBE___',
  '____EBBbbbbbbbbbbbbbbbbbbBBE____',
  '_____EBBBbbbbbbbbbbbbbbBBBE_____',
  '____EBBBbbbbbbbbbbbbbbbbBBBE____',
  '___EBBbbAAAAAAAAAAAAAAAAbbBBE___',
  '__EBBbbAAAAAAAAAAAAAAAAAAbbBBE__',
  '__EBbbAAAAAAAAHHHHAAAAAAAAbbBE__',
  '__EBbAAAAAAAHHHHHHAAAAAAAAAbBE__',
  '__EBbAAAAAAAAHHHHAAAAAAAAAAbBE__',
  '__EBbAAAAAAAAAAAAAAAAAAAAAAbBE__',
  '__EBbAAAAAAAAAAaaAAAAAAAAAAbBE__',
  '__EBlbAAAAAAAAaaaaAAAAAAAblBE___',
  '__EBBbbAAAAAAAAAAAAAAAAbbBBE____',
  '___EBBBbbbbbbbbbbbbbbbbBBBE_____',
  '____EEEEEEEEEEEEEEEEEEEEEE______',
]

// ── Pizza oven, scaled-up ─────────────────────────────────────────────
export const OVEN = [
  'EkkkkkkkkkkkkkkkkkkkkE',
  'Ekwwwwwwwwwwwwwwwwww kE',
  'EkwEEEEEEEEEEEEEEEEwkE',
  'EkwEFFFFFFFFFFFFFFEwkE',
  'EkwEFfFfFfFfFfFfFfEwkE',
  'EkwEFFFFFFFFFFFFFFEwkE',
  'EkwEFfFfFfFfFfFfFfEwkE',
  'EkwEFFFFFFFFFFFFFFEwkE',
  'EkwEFfFfFfFfFfFfFfEwkE',
  'EkwEEEEEEEEEEEEEEEEwkE',
  'Ekwwwwwwwwwwwwwwwwwwk E',
  'EkkwwwwwwwwwwwwwwwwkkE',
  'EkkkkkkkkkkkkkkkkkkkkE',
]

export function createTexture(
  scene: Phaser.Scene,
  key: string,
  grid: string[],
  scale = 1
): void {
  const cols = Math.max(...grid.map(r => r.length))
  const rows = grid.length
  const { canvas, ctx } = newCanvas(cols * scale, rows * scale)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = grid[y][x] ?? '_'
      const color = PALETTE[ch]
      if (!color || color[3] === 0) continue
      fill(ctx, x * scale, y * scale, scale, scale, color)
    }
  }
  register(scene, key, canvas)
}

// ── Procedural pizza layers (all on a SIZE×SIZE canvas, centered) ──────
const SIZE = 32
const CX = SIZE / 2 - 0.5
const CY = SIZE / 2 - 0.5

export function createPizzaDough(scene: Phaser.Scene, key: string) {
  const { canvas, ctx } = newCanvas(SIZE, SIZE)
  pixelCircle(ctx, CX, CY, 15, [232, 205, 150, 255]) // massa
  ring(ctx, CX, CY, 15, 12.5, [200, 165, 110, 255])  // borda
  outline(ctx, CX, CY, 15, [150, 115, 70, 255])
  speckle(ctx, CX, CY, 11, [212, 182, 125, 255], 18)
  register(scene, key, canvas)
}

export function createPizzaSauce(scene: Phaser.Scene, key: string) {
  const { canvas, ctx } = newCanvas(SIZE, SIZE)
  pixelCircle(ctx, CX, CY, 12, [205, 60, 45, 255])
  speckle(ctx, CX, CY, 10, [225, 95, 75, 255], 22)
  register(scene, key, canvas)
}

export function createPizzaCheese(scene: Phaser.Scene, key: string) {
  const { canvas, ctx } = newCanvas(SIZE, SIZE)
  pixelCircle(ctx, CX, CY, 12, [248, 232, 150, 255])
  speckle(ctx, CX, CY, 11, [225, 200, 110, 255], 26) // furos do queijo
  register(scene, key, canvas)
}

export function createPizzaPepperoni(scene: Phaser.Scene, key: string) {
  const { canvas, ctx } = newCanvas(SIZE, SIZE)
  scatterDiscs(ctx, 7, 3, [205, 70, 45, 255], [150, 45, 28, 255])
  register(scene, key, canvas)
}

export function createPizzaMushroom(scene: Phaser.Scene, key: string) {
  const { canvas, ctx } = newCanvas(SIZE, SIZE)
  const spots = [
    [10, 9], [21, 11], [15, 16], [9, 21], [22, 21],
  ]
  for (const [mx, my] of spots) drawMushroom(ctx, mx, my)
  register(scene, key, canvas)
}

// ── Low-level canvas helpers ──────────────────────────────────────────
function newCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return { canvas, ctx }
}

function register(scene: Phaser.Scene, key: string, canvas: HTMLCanvasElement) {
  if (scene.textures.exists(key)) scene.textures.remove(key)
  scene.textures.addCanvas(key, canvas)
}

function fill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGBA) {
  ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${c[3] / 255})`
  ctx.fillRect(x, y, w, h)
}

function pixelCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, c: RGBA) {
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) fill(ctx, x, y, 1, 1, c)
}

function ring(ctx: CanvasRenderingContext2D, cx: number, cy: number, rOut: number, rIn: number, c: RGBA) {
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      const d2 = (x - cx) ** 2 + (y - cy) ** 2
      if (d2 <= rOut * rOut && d2 > rIn * rIn) fill(ctx, x, y, 1, 1, c)
    }
}

function outline(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, c: RGBA) {
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      const d2 = (x - cx) ** 2 + (y - cy) ** 2
      if (d2 <= r * r && d2 > (r - 1) * (r - 1)) fill(ctx, x, y, 1, 1, c)
    }
}

function speckle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, c: RGBA, count: number) {
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2
    const dist = Math.random() * r
    const x = Math.round(cx + Math.cos(ang) * dist)
    const y = Math.round(cy + Math.sin(ang) * dist)
    fill(ctx, x, y, 1, 1, c)
  }
}

function scatterDiscs(ctx: CanvasRenderingContext2D, n: number, r: number, c: RGBA, dark: RGBA) {
  const positions = [
    [9, 9], [22, 9], [16, 14], [9, 21], [22, 21], [16, 24], [16, 6],
  ].slice(0, n)
  for (const [dx, dy] of positions) {
    discAt(ctx, dx, dy, r, c)
    fill(ctx, dx, dy, 1, 1, dark) // sombra central
  }
}

function discAt(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, c: RGBA) {
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++)
      if (x * x + y * y <= r * r) fill(ctx, cx + x, cy + y, 1, 1, c)
}

function drawMushroom(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const cap: RGBA = [225, 200, 150, 255]
  const stem: RGBA = [170, 140, 95, 255]
  // cabeça (semicírculo)
  for (let y = -3; y <= 0; y++)
    for (let x = -4; x <= 4; x++)
      if (x * x + (y * 2) ** 2 <= 16) fill(ctx, cx + x, cy + y, 1, 1, cap)
  // talo
  fill(ctx, cx - 1, cy + 1, 3, 3, stem)
}
