import Phaser from 'phaser'
import {
  createTexture,
  createPizzaDough,
  createPizzaSauce,
  createPizzaCheese,
  createPizzaPepperoni,
  createPizzaMushroom,
  CAPIVARA,
  OVEN,
} from '../sprites/PixelArt'
import { Pizza, type Ingredient, INGREDIENT_LABELS, INGREDIENT_KEYS } from '../objects/Pizza'

const ALL_INGREDIENTS: Ingredient[] = ['sauce', 'cheese', 'pepperoni', 'mushroom']

const ORDERS: Ingredient[][] = [
  ['sauce', 'cheese'],
  ['sauce', 'cheese', 'pepperoni'],
  ['sauce', 'cheese', 'mushroom'],
  ['sauce', 'cheese', 'pepperoni', 'mushroom'],
]

// Estações (posição X na cozinha)
const PREP_X = 180
const OVEN_X = 480
const DELIVER_X = 800
const STATION_RANGE = 120

const FLOOR_Y = 470 // pés da capivara
const WALK_MIN = 110
const WALK_MAX = 880
const SPEED = 0.34 // px por ms
const BAKE_TIME = 3500 // ms no forno

type Station = 'prep' | 'oven' | 'deliver'
type Carry = { ings: Ingredient[]; baked: boolean } | null

export class PizzeriaScene extends Phaser.Scene {
  private capivara!: Phaser.GameObjects.Image
  private prepPizza!: Pizza
  private ovenPizza!: Pizza
  private carriedPizza!: Pizza

  private carry: Carry = null
  private ovenState: 'empty' | 'baking' | 'ready' = 'empty'
  private ovenIngs: Ingredient[] = []
  private bakeProgress = 0

  private currentOrder: Ingredient[] = []
  private score = 0
  private lives = 3
  private timerValue = 45
  private busy = false

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keyA!: Phaser.Input.Keyboard.Key
  private keyD!: Phaser.Input.Keyboard.Key

  private timerEvent!: Phaser.Time.TimerEvent
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private orderContainer!: Phaser.GameObjects.Container
  private feedbackText!: Phaser.GameObjects.Text
  private promptText!: Phaser.GameObjects.Text
  private bakeBarBg!: Phaser.GameObjects.Rectangle
  private bakeBar!: Phaser.GameObjects.Rectangle

  constructor() {
    super({ key: 'PizzeriaScene' })
  }

  create() {
    this.score = 0
    this.lives = 3
    this.busy = false
    this.carry = null
    this.ovenState = 'empty'

    this.createTextures()
    this.buildScene()
    this.buildHUD()
    this.buildControls()
    this.setupInput()
    this.nextOrder()
  }

  private createTextures() {
    createTexture(this, 'capivara', CAPIVARA)
    createTexture(this, 'oven', OVEN)
    createPizzaDough(this, 'pizza_dough')
    createPizzaSauce(this, 'pizza_sauce')
    createPizzaCheese(this, 'pizza_cheese')
    createPizzaPepperoni(this, 'pizza_pepperoni')
    createPizzaMushroom(this, 'pizza_mushroom')
  }

  private buildScene() {
    const { width, height } = this.scale
    const wallTop = 80
    const wallBot = 300

    // Piso
    for (let x = 0; x < width; x += 48) {
      for (let y = wallBot; y < height; y += 48) {
        const col = (Math.floor(x / 48) + Math.floor(y / 48)) % 2
        this.add.rectangle(x, y, 48, 48, col === 0 ? 0xf2ebdc : 0xe4d8c2).setOrigin(0)
      }
    }

    // Parede de tijolos
    this.add.rectangle(0, wallTop, width, wallBot - wallTop, 0x7a4030).setOrigin(0)
    for (let row = 0; wallTop + row * 18 < wallBot; row++) {
      const yy = wallTop + row * 18
      const offset = (row % 2) * 32
      for (let xx = -32; xx < width; xx += 64) {
        this.add.rectangle(xx + offset, yy, 56, 14, 0xb05a3c).setOrigin(0)
      }
    }
    this.add.rectangle(0, wallBot - 6, width, 8, 0x5a2e1e).setOrigin(0)

    this.buildPrepStation()
    this.buildOvenStation()
    this.buildDeliverStation()

    // Capivara (jogador)
    this.capivara = this.add.image(width / 2, FLOOR_Y, 'capivara').setOrigin(0.5, 1)
    this.capivara.setScale(4).setDepth(6)

    // Pizza carregada (acima da cabeça)
    this.carriedPizza = new Pizza(this, this.capivara.x, FLOOR_Y - 180)
    this.carriedPizza.setScale(2.6).setDepth(7).setVisible(false)

    // Prompt contextual
    this.promptText = this.add.text(0, 0, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffffff',
      align: 'center', stroke: '#000000', strokeThickness: 4,
      backgroundColor: '#00000088', padding: { x: 6, y: 4 },
    }).setOrigin(0.5, 1).setDepth(12).setVisible(false)
  }

  private buildPrepStation() {
    // Bancada de preparo
    this.add.rectangle(PREP_X, 360, 180, 30, 0x9a6b3e).setDepth(1)
    this.add.rectangle(PREP_X, 372, 180, 90, 0x7d5530).setDepth(1)
    this.add.text(PREP_X, 318, 'BANCADA', {
      fontFamily: 'monospace', fontSize: '11px', color: '#5a3010',
    }).setOrigin(0.5).setDepth(2)
    // Tábua + pizza em preparo
    this.add.ellipse(PREP_X, 348, 120, 40, 0xe8dcc0).setDepth(2)
    this.prepPizza = new Pizza(this, PREP_X, 344)
    this.prepPizza.setScale(2.4).setDepth(3)
  }

  private buildOvenStation() {
    const oven = this.add.image(OVEN_X, 150, 'oven').setOrigin(0.5, 0).setScale(5).setDepth(1)
    oven.setName('oven')
    this.add.text(OVEN_X, 130, 'FORNO', {
      fontFamily: 'monospace', fontSize: '12px', color: '#5a3010',
    }).setOrigin(0.5).setDepth(2)

    // Pizza dentro do forno
    this.ovenPizza = new Pizza(this, OVEN_X, 250)
    this.ovenPizza.setScale(2.2).setDepth(2).setVisible(false)

    // Barra de progresso do forno
    this.bakeBarBg = this.add.rectangle(OVEN_X, 300, 120, 14, 0x000000, 0.6)
      .setDepth(3).setVisible(false)
    this.bakeBar = this.add.rectangle(OVEN_X - 58, 300, 0, 10, 0xff8c2a)
      .setOrigin(0, 0.5).setDepth(4).setVisible(false)
  }

  private buildDeliverStation() {
    // Balcão de entrega + janela do cliente
    this.add.rectangle(DELIVER_X, 360, 200, 30, 0xb8895a).setDepth(1)
    this.add.rectangle(DELIVER_X, 372, 200, 90, 0x96703f).setDepth(1)
    this.add.rectangle(DELIVER_X, 250, 150, 110, 0x2e1808).setDepth(0)
    this.add.rectangle(DELIVER_X, 250, 134, 94, 0x6aa0c8).setDepth(0)
    this.add.text(DELIVER_X, 318, 'ENTREGA', {
      fontFamily: 'monospace', fontSize: '11px', color: '#5a3010',
    }).setOrigin(0.5).setDepth(2)

    // Cliente (capivara com tom diferente)
    const customer = this.add.image(DELIVER_X, 320, 'capivara').setOrigin(0.5, 1)
    customer.setScale(2.6).setDepth(1).setTint(0xc8b0d8)
  }

  private buildHUD() {
    const { width } = this.scale
    this.add.rectangle(0, 0, width, 80, 0x2e1808).setOrigin(0).setDepth(10)
    this.add.rectangle(0, 78, width, 4, 0xc87040).setOrigin(0).setDepth(10)

    this.scoreText = this.add.text(14, 12, 'SCORE: 0', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f5e6c8',
    }).setDepth(11)
    this.livesText = this.add.text(14, 36, '♥ ♥ ♥', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ff5a5a',
    }).setDepth(11)
    this.timerText = this.add.text(this.scale.width - 14, 12, 'TEMPO: 45', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f5c060',
    }).setOrigin(1, 0).setDepth(11)

    this.add.text(this.scale.width / 2, 8, 'PEDIDO DO CLIENTE', {
      fontFamily: 'monospace', fontSize: '11px', color: '#bbbbbb',
    }).setOrigin(0.5, 0).setDepth(11)
    this.orderContainer = this.add.container(this.scale.width / 2, 48).setDepth(11)

    this.feedbackText = this.add.text(this.scale.width / 2, 360, '', {
      fontFamily: 'monospace', fontSize: '26px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20)

    this.timerEvent = this.time.addEvent({
      delay: 1000, callback: this.onTick, callbackScope: this, loop: true,
    })
  }

  private buildControls() {
    const { width, height } = this.scale
    const barH = 52
    const barY = height - barH
    const midY = barY + barH / 2
    this.add.rectangle(0, barY, width, barH, 0x1a0e04, 0.85).setOrigin(0).setDepth(15)
    this.add.rectangle(0, barY, width, 2, 0xc87040).setOrigin(0).setDepth(15)

    // Esquerda: andar
    this.add.text(14, midY, '< >  /  A D\nAndar', {
      fontFamily: 'monospace', fontSize: '12px', color: '#f5e6c8', align: 'left',
    }).setOrigin(0, 0.5).setDepth(16)

    // Centro: legenda dos ingredientes (a "colinha")
    const slotW = 150
    const startX = width / 2 - (ALL_INGREDIENTS.length * slotW) / 2 + slotW / 2
    ALL_INGREDIENTS.forEach((ing, i) => {
      const x = startX + i * slotW
      this.add.image(x - 48, midY, `pizza_${ing}`).setScale(1.0).setDepth(16)
      this.add.text(x - 28, midY - 12, `[${INGREDIENT_KEYS[ing]}]`, {
        fontFamily: 'monospace', fontSize: '15px', color: '#f5c060',
      }).setOrigin(0, 0).setDepth(16)
      this.add.text(x - 28, midY + 4, INGREDIENT_LABELS[ing], {
        fontFamily: 'monospace', fontSize: '11px', color: '#f5e6c8',
      }).setOrigin(0, 0).setDepth(16)
    })

    // Direita: interagir
    this.add.text(width - 14, midY, 'ESPACO\nInteragir', {
      fontFamily: 'monospace', fontSize: '12px', color: '#7aff7a', align: 'right',
    }).setOrigin(1, 0.5).setDepth(16)
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keyA = this.input.keyboard!.addKey('A')
    this.keyD = this.input.keyboard!.addKey('D')

    const map: Record<string, Ingredient> = {
      'keydown-Q': 'sauce', 'keydown-ONE': 'sauce',
      'keydown-W': 'cheese', 'keydown-TWO': 'cheese',
      'keydown-E': 'pepperoni', 'keydown-THREE': 'pepperoni',
      'keydown-R': 'mushroom', 'keydown-FOUR': 'mushroom',
    }
    Object.entries(map).forEach(([evt, ing]) => {
      this.input.keyboard!.on(evt, () => this.tryAddIngredient(ing))
    })
    this.input.keyboard!.on('keydown-SPACE', () => this.interact())
    this.input.keyboard!.on('keydown-ENTER', () => this.interact())
  }

  // ── Loop principal ──────────────────────────────────────────────────
  update(_time: number, delta: number) {
    if (!this.busy) {
      const left = this.cursors.left.isDown || this.keyA.isDown
      const right = this.cursors.right.isDown || this.keyD.isDown
      const moving = left !== right
      if (left) this.capivara.x -= SPEED * delta
      if (right) this.capivara.x += SPEED * delta
      this.capivara.x = Phaser.Math.Clamp(this.capivara.x, WALK_MIN, WALK_MAX)
      // Waddle ao andar
      this.capivara.rotation = moving ? Math.sin(_time * 0.018) * 0.05 : 0
    }

    // Pizza carregada segue a capivara
    this.carriedPizza.setPosition(this.capivara.x, FLOOR_Y - 180)

    // Forno assando
    if (this.ovenState === 'baking') {
      this.bakeProgress += delta
      const p = Phaser.Math.Clamp(this.bakeProgress / BAKE_TIME, 0, 1)
      this.bakeBar.width = 116 * p
      if (p >= 1) {
        this.ovenState = 'ready'
        this.bakeBar.setFillStyle(0x5aff5a)
        this.ovenPizza.setBaked(true)
        this.showFeedback('PIZZA ASSADA!', '#5aff5a')
      }
    }

    this.updatePrompt()
  }

  private nearestStation(): Station | null {
    const x = this.capivara.x
    if (Math.abs(x - PREP_X) < STATION_RANGE) return 'prep'
    if (Math.abs(x - OVEN_X) < STATION_RANGE) return 'oven'
    if (Math.abs(x - DELIVER_X) < STATION_RANGE) return 'deliver'
    return null
  }

  private updatePrompt() {
    if (this.busy) { this.promptText.setVisible(false); return }
    const st = this.nearestStation()
    let msg = ''
    let x = 0
    let y = 0

    if (st === 'prep') {
      x = PREP_X; y = 300
      msg = this.carry
        ? 'Maos ocupadas'
        : (this.prepPizza.isEmpty()
            ? 'Q/W/E/R: montar a pizza'
            : 'Q/W/E/R: ingredientes\n[ESPACO] pegar pizza')
    } else if (st === 'oven') {
      x = OVEN_X; y = 120
      if (this.ovenState === 'empty' && this.carry && !this.carry.baked) msg = '[ESPACO] colocar no forno'
      else if (this.ovenState === 'baking') msg = 'Assando...'
      else if (this.ovenState === 'ready') msg = '[ESPACO] tirar do forno'
    } else if (st === 'deliver') {
      x = DELIVER_X; y = 120
      if (this.carry && this.carry.baked) msg = '[ESPACO] entregar ao cliente'
      else if (this.carry && !this.carry.baked) msg = 'Asse a pizza antes!'
    }

    if (msg) {
      this.promptText.setText(msg).setPosition(x, y).setVisible(true)
    } else {
      this.promptText.setVisible(false)
    }
  }

  // ── Ações ───────────────────────────────────────────────────────────
  private tryAddIngredient(ing: Ingredient) {
    if (this.busy || this.carry || this.nearestStation() !== 'prep') return
    if (this.prepPizza.addIngredient(ing)) {
      this.showFeedbackAt(`+ ${INGREDIENT_LABELS[ing]}`, '#f5e6c8', PREP_X, 280)
    }
  }

  private interact() {
    if (this.busy) return
    const st = this.nearestStation()

    if (st === 'prep' && !this.carry && !this.prepPizza.isEmpty()) {
      this.carry = { ings: this.prepPizza.getIngredients(), baked: false }
      this.carriedPizza.setIngredients(this.carry.ings, false)
      this.carriedPizza.setVisible(true)
      this.prepPizza.reset()
      this.bumpCapivara()
      return
    }

    if (st === 'oven') {
      if (this.ovenState === 'empty' && this.carry && !this.carry.baked) {
        this.ovenIngs = this.carry.ings
        this.ovenPizza.setIngredients(this.ovenIngs, false)
        this.ovenPizza.setVisible(true)
        this.ovenState = 'baking'
        this.bakeProgress = 0
        this.bakeBar.width = 0
        this.bakeBar.setFillStyle(0xff8c2a).setVisible(true)
        this.bakeBarBg.setVisible(true)
        this.carry = null
        this.carriedPizza.setVisible(false)
        return
      }
      if (this.ovenState === 'ready') {
        this.carry = { ings: this.ovenIngs, baked: true }
        this.carriedPizza.setIngredients(this.carry.ings, true)
        this.carriedPizza.setVisible(true)
        this.ovenState = 'empty'
        this.ovenPizza.setVisible(false)
        this.bakeBar.setVisible(false)
        this.bakeBarBg.setVisible(false)
        this.bumpCapivara()
        return
      }
    }

    if (st === 'deliver' && this.carry && this.carry.baked) {
      this.deliver()
    }
  }

  private deliver() {
    const correct =
      this.carry!.ings.length === this.currentOrder.length &&
      this.currentOrder.every(i => this.carry!.ings.includes(i))

    this.carry = null
    this.carriedPizza.setVisible(false)

    if (correct) {
      const bonus = this.timerValue * 5
      this.score += 100 + bonus
      this.scoreText.setText(`SCORE: ${this.score}`)
      this.showFeedback(`PERFEITA! +${100 + bonus}`, '#5aff5a')
      this.busy = true
      this.time.delayedCall(1100, () => this.nextOrder())
    } else {
      this.loseLife('PEDIDO ERRADO!')
    }
  }

  private loseLife(msg: string) {
    this.lives--
    this.livesText.setText(this.lives > 0 ? Array(this.lives).fill('♥').join(' ') : '')
    this.showFeedback(msg, '#ff5a5a')
    this.busy = true
    this.time.delayedCall(1100, () => {
      if (this.lives <= 0) this.gameOver()
      else this.nextOrder()
    })
  }

  private nextOrder() {
    this.busy = false
    this.carry = null
    this.carriedPizza.setVisible(false)
    this.prepPizza.reset()
    this.ovenState = 'empty'
    this.ovenPizza.setVisible(false)
    this.bakeBar.setVisible(false)
    this.bakeBarBg.setVisible(false)
    this.timerValue = 45
    this.timerText.setText('TEMPO: 45').setColor('#f5c060')
    this.currentOrder = Phaser.Utils.Array.GetRandom(ORDERS)
    this.updateOrderDisplay()
  }

  private updateOrderDisplay() {
    this.orderContainer.removeAll(true)
    const spacing = 44
    let x = (-(this.currentOrder.length - 1) * spacing) / 2
    this.currentOrder.forEach(ing => {
      const icon = this.add.image(x, 0, `pizza_${ing}`).setScale(1.4)
      this.orderContainer.add(icon)
      x += spacing
    })
  }

  private onTick() {
    if (this.busy) return
    this.timerValue--
    this.timerText.setText(`TEMPO: ${this.timerValue}`)
      .setColor(this.timerValue <= 10 ? '#ff5a5a' : '#f5c060')
    if (this.timerValue <= 0) this.loseLife('TEMPO ESGOTADO!')
  }

  private bumpCapivara() {
    this.tweens.add({
      targets: this.capivara, scaleY: 3.7, duration: 90, yoyo: true,
      onComplete: () => this.capivara.setScale(4),
    })
  }

  private showFeedback(msg: string, color: string) {
    this.showFeedbackAt(msg, color, this.scale.width / 2, 360)
  }

  private showFeedbackAt(msg: string, color: string, x: number, y: number) {
    this.feedbackText.setText(msg).setColor(color).setAlpha(1).setPosition(x, y)
    this.tweens.add({ targets: this.feedbackText, alpha: 0, y: y - 30, duration: 900 })
  }

  private gameOver() {
    this.timerEvent.remove()
    this.scene.start('MenuScene', { score: this.score })
  }
}
