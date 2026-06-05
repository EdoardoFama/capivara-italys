import Phaser from 'phaser'
import {
  createTexture,
  CAPIVARA,
  PIZZA_DOUGH,
  PIZZA_SAUCE,
  PIZZA_CHEESE,
  PIZZA_PEPPERONI,
  PIZZA_MUSHROOM,
  OVEN,
} from '../sprites/PixelArt'
import { Pizza, type Ingredient, INGREDIENT_LABELS, INGREDIENT_KEYS } from '../objects/Pizza'

const ORDERS: Ingredient[][] = [
  ['sauce', 'cheese'],
  ['sauce', 'cheese', 'pepperoni'],
  ['sauce', 'cheese', 'mushroom'],
  ['sauce', 'cheese', 'pepperoni', 'mushroom'],
]

const ALL_INGREDIENTS: Ingredient[] = ['sauce', 'cheese', 'pepperoni', 'mushroom']

export class PizzeriaScene extends Phaser.Scene {
  private capivara!: Phaser.GameObjects.Image
  private pizza!: Pizza
  private currentOrder: Ingredient[] = []
  private score = 0
  private lives = 3
  private timerValue = 30

  private timerEvent!: Phaser.Time.TimerEvent
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private orderContainer!: Phaser.GameObjects.Container
  private feedbackText!: Phaser.GameObjects.Text
  private busy = false

  constructor() {
    super({ key: 'PizzeriaScene' })
  }

  create() {
    this.score = 0
    this.lives = 3
    this.busy = false

    this.createTextures()
    this.buildScene()
    this.buildHUD()
    this.buildControls()
    this.setupInput()
    this.nextOrder()
  }

  private createTextures() {
    createTexture(this, 'capivara', CAPIVARA)
    createTexture(this, 'pizza_dough', PIZZA_DOUGH)
    createTexture(this, 'pizza_sauce', PIZZA_SAUCE)
    createTexture(this, 'pizza_cheese', PIZZA_CHEESE)
    createTexture(this, 'pizza_pepperoni', PIZZA_PEPPERONI)
    createTexture(this, 'pizza_mushroom', PIZZA_MUSHROOM)
    createTexture(this, 'oven', OVEN)
  }

  private buildScene() {
    const { width, height } = this.scale
    const wallTop = 40
    const wallBot = 120
    const counterY = 200

    // Piso de azulejo italiano
    for (let x = 0; x < width; x += 24) {
      for (let y = wallBot; y < height; y += 24) {
        const col = (Math.floor(x / 24) + Math.floor(y / 24)) % 2
        this.add.rectangle(x, y, 24, 24, col === 0 ? 0xf2ebdc : 0xe4d8c2).setOrigin(0)
      }
    }

    // Parede de tijolos (mortar de fundo + tijolos escalonados)
    this.add.rectangle(0, wallTop, width, wallBot - wallTop, 0x7a4030).setOrigin(0)
    for (let row = 0; wallTop + row * 9 < wallBot; row++) {
      const yy = wallTop + row * 9
      const offset = (row % 2) * 16
      for (let xx = -16; xx < width; xx += 32) {
        this.add.rectangle(xx + offset, yy, 28, 7, 0xb05a3c).setOrigin(0)
      }
    }
    // Rodapé entre parede e piso
    this.add.rectangle(0, wallBot - 3, width, 4, 0x5a2e1e).setOrigin(0)

    // Quadro decorativo na parede
    this.add.rectangle(60, 65, 40, 30, 0x3a2010).setOrigin(0.5)
    this.add.rectangle(60, 65, 34, 24, 0x8fb96a).setOrigin(0.5)
    this.add.circle(60, 70, 7, 0xf0d060)

    // Forno
    const oven = this.add.image(width - 48, wallBot + 6, 'oven').setOrigin(0.5, 0)
    oven.setScale(2.2)
    this.add.text(width - 48, wallBot + 2, 'FORNO', {
      fontFamily: 'monospace', fontSize: '5px', color: '#5a3010',
    }).setOrigin(0.5, 1)
    // Brilho do fogo pulsando
    const glow = this.add.rectangle(width - 48, wallBot + 22, 26, 22, 0xffaa30, 0.25)
    this.tweens.add({ targets: glow, alpha: 0.5, duration: 700, yoyo: true, repeat: -1 })

    // Balcão de madeira
    this.add.rectangle(0, counterY, width, height - counterY, 0xb8895a).setOrigin(0)
    this.add.rectangle(0, counterY, width, 5, 0x8a6038).setOrigin(0)
    for (let x = 0; x < width; x += 40) {
      this.add.rectangle(x + 1, counterY + 8, 38, height - counterY - 12, 0xc69a68).setOrigin(0)
    }

    // Tábua de pizza no balcão
    this.add.circle(width / 2, counterY + 30, 34, 0xe8dcc0)
    this.add.circle(width / 2, counterY + 30, 34, 0xccbb99).setStrokeStyle(2, 0x9a7a52)

    // Pizza (container que recebe os ingredientes)
    this.pizza = new Pizza(this, width / 2, counterY + 30)
    this.pizza.setScale(3)

    // Capivara chef atrás do balcão
    this.capivara = this.add.image(width / 2, counterY + 4, 'capivara').setOrigin(0.5, 1)
    this.capivara.setScale(3)
  }

  private buildHUD() {
    const { width } = this.scale

    // Barra superior
    this.add.rectangle(0, 0, width, 40, 0x2e1808).setOrigin(0)
    this.add.rectangle(0, 39, width, 2, 0xc87040).setOrigin(0)

    this.scoreText = this.add.text(6, 5, 'SCORE: 0', {
      fontFamily: 'monospace', fontSize: '7px', color: '#f5e6c8',
    })

    this.livesText = this.add.text(6, 16, '♥ ♥ ♥', {
      fontFamily: 'monospace', fontSize: '7px', color: '#ff5a5a',
    })

    this.timerText = this.add.text(width - 6, 5, 'TEMPO: 30', {
      fontFamily: 'monospace', fontSize: '7px', color: '#f5c060',
    }).setOrigin(1, 0)

    // Painel do pedido (centro)
    this.add.text(width / 2, 4, 'PEDIDO DO CLIENTE', {
      fontFamily: 'monospace', fontSize: '5px', color: '#bbbbbb',
    }).setOrigin(0.5, 0)
    this.orderContainer = this.add.container(width / 2, 24)

    // Feedback central
    this.feedbackText = this.add.text(width / 2, 150, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(20)

    this.timerEvent = this.time.addEvent({
      delay: 1000, callback: this.onTick, callbackScope: this, loop: true,
    })
  }

  private buildControls() {
    const { width, height } = this.scale
    const barY = height - 12

    // Faixa de fundo dos controles
    this.add.rectangle(0, height - 24, width, 24, 0x1a0e04, 0.78).setOrigin(0).setDepth(15)

    const items: { key: string; ing: Ingredient }[] = ALL_INGREDIENTS.map(ing => ({
      key: INGREDIENT_KEYS[ing], ing,
    }))

    const slotW = 96
    const startX = width / 2 - (items.length * slotW) / 2 + slotW / 2

    items.forEach((it, i) => {
      const x = startX + i * slotW
      this.add.image(x - 32, barY, `pizza_${it.ing}`).setScale(0.85).setDepth(16)
      this.add.text(x - 22, barY - 7, `[${it.key}]`, {
        fontFamily: 'monospace', fontSize: '7px', color: '#f5c060',
      }).setOrigin(0, 0).setDepth(16)
      this.add.text(x - 22, barY + 1, INGREDIENT_LABELS[it.ing], {
        fontFamily: 'monospace', fontSize: '5px', color: '#f5e6c8',
      }).setOrigin(0, 0).setDepth(16)
    })

    // Dica de entregar
    this.add.text(width - 6, barY, '[ENTER] Entregar', {
      fontFamily: 'monospace', fontSize: '6px', color: '#7aff7a',
    }).setOrigin(1, 0.5).setDepth(16)
  }

  private setupInput() {
    const map: Record<string, Ingredient> = {
      'keydown-Q': 'sauce', 'keydown-ONE': 'sauce',
      'keydown-W': 'cheese', 'keydown-TWO': 'cheese',
      'keydown-E': 'pepperoni', 'keydown-THREE': 'pepperoni',
      'keydown-R': 'mushroom', 'keydown-FOUR': 'mushroom',
    }
    Object.entries(map).forEach(([evt, ing]) => {
      this.input.keyboard!.on(evt, () => this.tryAddIngredient(ing))
    })
    this.input.keyboard!.on('keydown-ENTER', () => this.submitPizza())
    this.input.keyboard!.on('keydown-SPACE', () => this.submitPizza())
    this.input.keyboard!.on('keydown-BACKSPACE', () => {
      if (!this.busy) { this.pizza.reset(); this.showFeedback('Limpou', '#cccccc') }
    })
  }

  private tryAddIngredient(ing: Ingredient) {
    if (this.busy) return
    if (this.pizza.addIngredient(ing)) {
      // Bounce de "cozinhar"
      this.tweens.add({
        targets: this.capivara, scaleY: 2.7, duration: 80, yoyo: true,
        onComplete: () => this.capivara.setScale(3),
      })
      this.showFeedback(`+ ${INGREDIENT_LABELS[ing]}`, '#f5e6c8')
    }
  }

  private submitPizza() {
    if (this.busy || this.pizza.getIngredients().length === 0) return

    if (this.pizza.matches(this.currentOrder)) {
      const bonus = this.timerValue * 5
      this.score += 100 + bonus
      this.scoreText.setText(`SCORE: ${this.score}`)
      this.showFeedback(`PERFEITA! +${100 + bonus}`, '#5aff5a')
      this.busy = true
      this.time.delayedCall(1100, () => this.nextOrder())
    } else {
      this.loseLife('PIZZA ERRADA!')
    }
  }

  private loseLife(msg: string) {
    this.lives--
    this.livesText.setText(
      this.lives > 0 ? Array(this.lives).fill('♥').join(' ') : ''
    )
    this.showFeedback(msg, '#ff5a5a')
    this.pizza.reset()
    this.busy = true
    if (this.lives <= 0) {
      this.time.delayedCall(1100, () => this.gameOver())
    } else {
      this.time.delayedCall(1100, () => this.nextOrder())
    }
  }

  private nextOrder() {
    this.busy = false
    this.pizza.reset()
    this.timerValue = 30
    this.timerText.setText('TEMPO: 30').setColor('#f5c060')
    this.currentOrder = Phaser.Utils.Array.GetRandom(ORDERS)
    this.updateOrderDisplay()
  }

  private updateOrderDisplay() {
    this.orderContainer.removeAll(true)
    const spacing = 22
    let x = (-(this.currentOrder.length - 1) * spacing) / 2
    this.currentOrder.forEach(ing => {
      const icon = this.add.image(x, 0, `pizza_${ing}`).setScale(0.9)
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

  private showFeedback(msg: string, color: string) {
    this.feedbackText.setText(msg).setColor(color).setAlpha(1).setY(150)
    this.tweens.add({
      targets: this.feedbackText, alpha: 0, y: 135, duration: 900,
    })
  }

  private gameOver() {
    this.timerEvent.remove()
    this.scene.start('MenuScene', { score: this.score })
  }
}
