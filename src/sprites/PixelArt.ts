// Pixel art sprites defined as string grids.
// Each character = 1 pixel. Use createTexture() to register into Phaser.

const PALETTE: Record<string, [number, number, number, number]> = {
  '_': [0,   0,   0,   0  ], // transparent
  'B': [110, 68,  38,  255], // body brown (dark)
  'b': [150, 98,  58,  255], // body brown (medium)
  'l': [190, 138, 92,  255], // light brown (snout/cheeks)
  'W': [245, 245, 240, 255], // white (chef hat)
  'z': [25,  15,  10,  255], // eye
  'p': [60,  35,  20,  255], // nostril
  'E': [40,  22,  12,  255], // outline (dark brown)
  'A': [248, 244, 224, 255], // apron cream
  'H': [200, 60,  50,  255], // red (apron collar / tie)
  'R': [195, 48,  40,  255], // tomato sauce
  'r': [225, 90,  72,  255], // light sauce
  'C': [248, 238, 170, 255], // cheese
  'c': [210, 190, 120, 255], // cheese shadow
  'O': [205, 70,  45,  255], // pepperoni
  'o': [150, 45,  28,  255], // pepperoni dark
  'S': [225, 200, 150, 255], // mushroom cap (tan)
  's': [170, 140, 95,  255], // mushroom shadow
  'D': [232, 205, 150, 255], // dough light
  'd': [200, 172, 120, 255], // dough shadow
  'F': [250, 220, 90,  255], // oven fire
  'f': [240, 150, 40,  255], // oven fire dark
  'k': [120, 110, 100, 255], // oven metal dark
  'w': [190, 180, 168, 255], // oven metal light
}

// ── Capivara chef (front view, head + apron) ──────────────────────────
export const CAPIVARA = [
  '________EEEEEEEE________',
  '______EEWWWWWWWWEE______',
  '_____EWWWWWWWWWWWWE_____',
  '_____EWWWWWWWWWWWWE_____',
  '____EEEEEEEEEEEEEEEE____',
  '____EWWWWWWWWWWWWWWE____',
  '____EEEEEEEEEEEEEEEE____',
  '___EbE____________EbE___',
  '___EBBBBBBBBBBBBBBBBE___',
  '__EBbbbbbbbbbbbbbbbbBE__',
  '__EBbbzzbbbbbbbbzzbbBE__',
  '__EBbbzzbbbbbbbbzzbbBE__',
  '__EBbbbbbbbbbbbbbbbbBE__',
  '__EBbbblllllllllllbbBE__',
  '__EBbbllpllllllpllbbBE__',
  '__EBbbbllllllllllbbbBE__',
  '__EBBbbbbbbbbbbbbbbBBE__',
  '___EBBbbbbbbbbbbbbBBE___',
  '___EBBAAAAAAAAAAAABBE___',
  '__EBBAAAAAAAAAAAAAABBE__',
  '__EBAAAAAAAHHAAAAAAABE__',
  '__EBAAAAAAHHHHAAAAAABE__',
  '__EBAAAAAAAHHAAAAAAABE__',
  '__EBlAAAAAAAAAAAAAAlBE__',
  '__EBBAAAAAAAAAAAAAABBE__',
  '__EBBBBBBBBBBBBBBBBBBE__',
  '___EEEEEEEEEEEEEEEEEE___',
]

// ── Pizza layers (all 16x16, stack on top of each other) ──────────────
export const PIZZA_DOUGH = [
  '____EDDDDDDDDDE_____',
  '__EDDDDdddddDDDDE___',
  '_EDDDddDDDDDddDDDE__',
  'EDDDdDDDDDDDDDdDDDE_',
  'EDDdDDDDDDDDDDDdDDE_',
  'EDDDDDDDDDDDDDDDdDE_',
  'EDDDDDDDDDDDDDDDDDE_',
  'EDDDDDDDDDDDDDDDDDE_',
  'EDDDDDDDDDDDDDDDDDE_',
  'EDDDDDDDDDDDDDDDDDE_',
  'EDDdDDDDDDDDDDDDDDE_',
  'EDDDdDDDDDDDDDDdDDE_',
  '_EDDDddDDDDDddDDDE__',
  '__EDDDDdddddDDDDE___',
  '____EDDDDDDDDDE_____',
  '___________________',
]

export const PIZZA_SAUCE = [
  '___________________',
  '______ERRRRRE______',
  '____ERRrrrrrRRE____',
  '___ERRrrrrrrrRRE___',
  '__ERRrrrrrrrrrRRE__',
  '__ERrrrrrrrrrrrRE__',
  '__ERrrrrrrrrrrrRE__',
  '__ERrrrrrrrrrrrRE__',
  '__ERrrrrrrrrrrrRE__',
  '__ERRrrrrrrrrrRRE__',
  '___ERRrrrrrrrRRE___',
  '____ERRrrrrrRRE____',
  '______ERRRRRE______',
  '___________________',
  '___________________',
  '___________________',
]

export const PIZZA_CHEESE = [
  '___________________',
  '_______ECCCCE______',
  '_____ECCcccCCCE____',
  '____ECCccCCcccCE___',
  '___ECCCCccCCcCCCE__',
  '___ECcCCCCCCcCCcE__',
  '___ECCCcCCcCCCCCE__',
  '___ECCCCCCcCCCcCE__',
  '___ECCcCCCCCcCCCE__',
  '____ECCCccCCccCE___',
  '_____ECCcccCCE_____',
  '_______ECCCCE______',
  '___________________',
  '___________________',
  '___________________',
  '___________________',
]

export const PIZZA_PEPPERONI = [
  '___________________',
  '___OOO______OOO____',
  '__OoooO____OoooO___',
  '__OoooO____OoooO___',
  '___OOO______OOO____',
  '________OOO________',
  '_______OoooO_______',
  '_______OoooO_______',
  '________OOO________',
  '___OOO______OOO____',
  '__OoooO____OoooO___',
  '__OoooO____OoooO___',
  '___OOO______OOO____',
  '___________________',
  '___________________',
  '___________________',
]

export const PIZZA_MUSHROOM = [
  '___________________',
  '___SSSS_____SSSS___',
  '__SSSSSS___SSSSSS__',
  '__SSssSS___SSssSS__',
  '___SssS_____SssS___',
  '___SssS_____SssS___',
  '________SSSS_______',
  '_______SSSSSS______',
  '_______SSssSS______',
  '________SssS_______',
  '________SssS_______',
  '___SSSS____________',
  '__SSSSSS___________',
  '__SSssSS___________',
  '___SssS____________',
  '___________________',
]

// ── Pizza oven ────────────────────────────────────────────────────────
export const OVEN = [
  'EkkkkkkkkkkkkkkkkE',
  'EkwwwwwwwwwwwwwwkE',
  'EkwEEEEEEEEEEEEwkE',
  'EkwEFFFFFFFFFFEwkE',
  'EkwEFfFfFfFfFfEwkE',
  'EkwEFFFFFFFFFFEwkE',
  'EkwEFfFfFfFfFfEwkE',
  'EkwEFFFFFFFFFFEwkE',
  'EkwEEEEEEEEEEEEwkE',
  'EkwwwwwwwwwwwwwwkE',
  'EkkwwwwwwwwwwwwkkE',
  'EkkkkkkkkkkkkkkkkE',
]

export function createTexture(
  scene: Phaser.Scene,
  key: string,
  grid: string[],
  scale = 1
): void {
  const cols = Math.max(...grid.map(r => r.length))
  const rows = grid.length
  const canvas = document.createElement('canvas')
  canvas.width = cols * scale
  canvas.height = rows * scale
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = grid[y][x] ?? '_'
      const color = PALETTE[ch]
      if (!color || color[3] === 0) continue
      ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3] / 255})`
      ctx.fillRect(x * scale, y * scale, scale, scale)
    }
  }

  if (scene.textures.exists(key)) scene.textures.remove(key)
  scene.textures.addCanvas(key, canvas)
}
