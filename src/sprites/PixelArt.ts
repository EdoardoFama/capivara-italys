// Pixel art sprites defined as string grids.
// Each character = 1 pixel. Scale determines real pixel size.
// Use createTexture() to register into Phaser's texture manager.

const PALETTE: Record<string, [number, number, number, number]> = {
  '_': [0,   0,   0,   0  ], // transparent
  'B': [90,  55,  25,  255], // dark brown (body)
  'b': [130, 85,  50,  255], // medium brown
  'l': [175, 125, 80,  255], // light brown
  'W': [240, 240, 235, 255], // white (hat)
  'G': [190, 190, 185, 255], // gray (hat shadow)
  'Y': [220, 180, 40,  255], // yellow (hat band)
  'P': [215, 155, 130, 255], // pink (muzzle)
  'p': [170, 95,  75,  255], // dark pink (nose tip)
  'E': [20,  8,   0,   255], // near-black (outline)
  'A': [240, 235, 210, 255], // cream (apron)
  'R': [200, 50,  40,  255], // red (tomato sauce)
  'r': [240, 100, 80,  255], // light red
  'O': [230, 120, 30,  255], // orange (pepperoni rim)
  'o': [190, 70,  20,  255], // dark orange
  'C': [250, 245, 200, 255], // cream/cheese
  'c': [210, 200, 140, 255], // cheese shadow
  'T': [120, 180, 60,  255], // green (basil)
  't': [80,  140, 40,  255], // dark green
  'S': [210, 200, 180, 255], // dough light
  's': [180, 165, 130, 255], // dough shadow
  'F': [250, 220, 80,  255], // fire/cooking glow
  'f': [240, 160, 30,  255], // fire dark
  'w': [200, 195, 185, 255], // counter stone light
  'k': [160, 155, 145, 255], // counter stone dark
  'K': [100, 95,  85,  255], // counter dark grout
  'M': [190, 140, 90,  255], // wood light
  'm': [140, 100, 55,  255], // wood dark
  'H': [220, 60,  60,  255], // red apron stripe
  'n': [70,  40,  15,  255], // very dark brown (legs/hooves)
  'e': [255, 255, 255, 255], // eye white
  'z': [30,  20,  80,  255], // eye pupil (dark blue)
}

// 16x24 capivara chef - idle frame
export const CAPIVARA_IDLE = [
  '_EEWWWWWWWWWWEE_',
  '_EWWWWWWWWWWWWE_',
  '_EWWWWWWWWWWWWE_',
  '_EYYYYYYYYYYYYE_',
  '__EBBBbbbbBBBE__',
  '_EBBBlllllllBBE_',
  '_EBBEezeEEezeE_E',
  '_EBBBlllllllBBE_',
  '_EBbbPPPPPPbbBE_',
  '__EBbPPppPPbBE__',
  '___EBBBBBBBBbE__',
  '__EBAAAAAAAABE__',
  '_EBAAAAAHAAAAbE_',
  '_EBAAAAHHAAAAbE_',
  '__EBbBBBBBBbBE__',
  '__EnnnB__BnnnE__',
  '__EnnnB__BnnnE__',
]

// 16x24 capivara chef - walk frame 1
export const CAPIVARA_WALK1 = [
  '_EEWWWWWWWWWWEE_',
  '_EWWWWWWWWWWWWE_',
  '_EWWWWWWWWWWWWE_',
  '_EYYYYYYYYYYYYE_',
  '__EBBBbbbbBBBE__',
  '_EBBBlllllllBBE_',
  '_EBBEezeEEezeE_E',
  '_EBBBlllllllBBE_',
  '_EBbbPPPPPPbbBE_',
  '__EBbPPppPPbBE__',
  '___EBBBBBBBBbE__',
  '__EBAAAAAAAABE__',
  '_EBAAAAAHAAAAbE_',
  '_EBAAAAHHAAAAbE_',
  '__EBbBBBBBBbBE__',
  '__EBnnnB_BnnnE__',
  '_EBnnnE__EBnnnE_',
]

// 16x24 capivara chef - walk frame 2
export const CAPIVARA_WALK2 = [
  '_EEWWWWWWWWWWEE_',
  '_EWWWWWWWWWWWWE_',
  '_EWWWWWWWWWWWWE_',
  '_EYYYYYYYYYYYYE_',
  '__EBBBbbbbBBBE__',
  '_EBBBlllllllBBE_',
  '_EBBEezeEEezeE_E',
  '_EBBBlllllllBBE_',
  '_EBbbPPPPPPbbBE_',
  '__EBbPPppPPbBE__',
  '___EBBBBBBBBbE__',
  '__EBAAAAAAAABE__',
  '_EBAAAAAHAAAAbE_',
  '_EBAAAAHHAAAAbE_',
  '__EBbBBBBBBbBE__',
  '_EBnnnE__EBnnnE_',
  '__EBnnnB_BnnnE__',
]

// 16x16 pizza dough (base)
export const PIZZA_DOUGH = [
  '____ESsssssSE___',
  '__ESSssssssssSE_',
  '_ESSsssssSSsssSE',
  'ESSsssSSSSSSsssSE',
  'ESSsSSSSSSSSSssE',
  'ESSSSSSSSSSSSssE',
  'ESSSSSSSSSSSSSsE',
  'ESSSSSSSSSSSSSsE',
  'ESSSSSSSSSSSSSsE',
  'ESSSSSSSSSSSSSsE',
  'ESSSSSSSSSSSSSsE',
  'ESSSSSSSSSSSSssE',
  'ESSsSSSSSSSSSssE',
  '_ESSsssSSSSsssSE',
  '__ESSssssssssSE_',
  '____ESsssssSE___',
]

// 16x16 tomato sauce on pizza
export const PIZZA_SAUCE = [
  '________________',
  '________________',
  '____ERrrrRE_____',
  '___ERrrrrrRE____',
  '__ERrrrrrrrRE___',
  '__ERrrrRrrrrE___',
  '__ERrrrrrrrrE___',
  '__ERrrrrrrrrE___',
  '__ERrRrrrRrrE___',
  '__ERrrrrrrrrE___',
  '__ERrrrrrrrRE___',
  '___ERrrrrrRE____',
  '____ERrrrRE_____',
  '________________',
  '________________',
  '________________',
]

// 16x16 cheese on pizza
export const PIZZA_CHEESE = [
  '________________',
  '________________',
  '___ECCcCCCE_____',
  '__ECCCcccCCCE___',
  '_ECCCcccccCCCE__',
  '_ECCCCcCCCCCCE__',
  '_ECCCCCCCcCCCE__',
  '_ECCcCCCCCCCCE__',
  '_ECCCCCCcCCCCE__',
  '_ECCCCCCCCCcCE__',
  '_ECCCcCCCCCCCE__',
  '__ECCCcccCCCE___',
  '___ECCcCCCE_____',
  '________________',
  '________________',
  '________________',
]

// 8x8 pepperoni slice
export const PEPPERONI = [
  '_EoooE__',
  'EoOOOoE_',
  'EoOoOOoE',
  'EoOOOOoE',
  'EooOOooE',
  '_EoooooE',
  '__EoooE_',
  '________',
]

// 8x8 mushroom
export const MUSHROOM = [
  '__EttE__',
  '_ETTTtE_',
  'ETTTTttE',
  'ETTTTttE',
  '_ETTTtE_',
  '__EttE__',
  '_EttttE_',
  '__EttE__',
]

// 16x16 pizza box (closed)
export const PIZZA_BOX = [
  'EMMMMMMMMMMMMmmE',
  'MmmmmmmmmmmmmmmM',
  'MmMMMMMMMMMMmmmM',
  'MmMRRRRRRRRMmmmM',
  'MmMRMMMMMMRMmmmM',
  'MmMRMEEEEMRMmmmM',
  'MmMRMEMMEMRMmmmM',
  'MmMRMEMMEMRMmmmM',
  'MmMRMEEEEMRMmmmM',
  'MmMRMMMMMMRMmmmM',
  'MmMRRRRRRRRMmmmM',
  'MmMMMMMMMMMMmmmM',
  'MmmmmmmmmmmmmmmM',
  'MmmmmmmmmmmmmmME',
  'EMMMMMMMMMMMMMmE',
  'EEEEEEEEEEEEEEeE',
]

// 32x16 counter/table tile
export const COUNTER_TILE = [
  'EwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwE',
  'EwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwE',
  'EwKkwKkwKkwKkwKkwKkwKkwKkwKkwKkE',
  'EwkwwkwwkwwkwwkwwkwwkwwkwwkwwkwE',
  'EKwwwKwwwKwwwKwwwKwwwKwwwKwwwKwE',
  'EkwwwkwwwkwwwkwwwkwwwkwwwkwwwkwE',
  'EwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwE',
  'EKKKKKKKKKKKKKKKKKKKKKKKKKKKKKkE',
]

// 16x16 pizza oven (front)
export const OVEN_FRONT = [
  'EkkkkkkkkkkkkkkE',
  'EkwwwwwwwwwwwwkE',
  'EkwFFFFFFFFFwwkE',
  'EkwFfFfFfFfFwwkE',
  'EkwFFFFFFFFFwwkE',
  'EkwwwwwwwwwwwwkE',
  'EkKKKKKKKKKKKKkE',
  'EkKwwwwwwwwwwKkE',
  'EkKwwwwwwwwwwKkE',
  'EkKwwwwwwwwwwKkE',
  'EkKwwwwwwwwwwKkE',
  'EkKwwwwwwwwwwKkE',
  'EkKwwwwwwwwwwKkE',
  'EkKKKKKKKKKKKKkE',
  'EkkkkkkkkkkkkkkkE',
  'EEEEEEEEEEEEEEeE',
]

export function createTexture(
  scene: Phaser.Scene,
  key: string,
  grid: string[],
  scale = 1
): void {
  const cols = grid[0].length
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

export function createSpritesheet(
  scene: Phaser.Scene,
  key: string,
  frames: string[][],
  scale = 1
): void {
  const cols = frames[0][0].length
  const rows = frames[0].length
  const canvas = document.createElement('canvas')
  canvas.width = cols * scale * frames.length
  canvas.height = rows * scale
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  frames.forEach((grid, fi) => {
    const offsetX = fi * cols * scale
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const ch = grid[y]?.[x] ?? '_'
        const color = PALETTE[ch]
        if (!color || color[3] === 0) continue
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3] / 255})`
        ctx.fillRect(offsetX + x * scale, y * scale, scale, scale)
      }
    }
  })

  if (scene.textures.exists(key)) scene.textures.remove(key)
  scene.textures.addCanvas(key, canvas)
  scene.textures.get(key).add('__BASE', 0, 0, 0, cols * scale * frames.length, rows * scale)

  for (let i = 0; i < frames.length; i++) {
    scene.textures.get(key).add(i, 0, i * cols * scale, 0, cols * scale, rows * scale)
  }
}
