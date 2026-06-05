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
    const wallBot = 240
    const counterY = 400

    // Piso de azulejo italiano
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

    // Quadro decorativo
    this.add.rectangle(120, 130, 80, 60, 0x3a2010).setOrigin(0.5)
    this.add.rectangle(120, 130, 68, 48, 0x8fb96a).setOrigin(0.5)
    this.add.circle(120, 140, 14, 0xf0d060)

    // Forno
    const oven = this.add.image(width - 96, wallBot + 12, 'oven').setOrigin(0.5, 0)
    oven.setScale(4)
    this.add.text(width - 96, wallBot + 6, 'FORNO', {
      fontFamily: 'monospace', fontSize: '10px', color: '#5a3010',
    }).setOrigin(0.5, 1)
    const glow = this.add.rectangle(width - 96, wallBot + 48, 52, 44, 0xffaa30, 0.25)
    this.tweens.add({ targets: glow, alpha: 0.5, duration: 700, yoyo: true, repeat: -1 })

    // Balcão de madeira
    this.add.rectangle(0, counterY, width, height - counterY, 0xb8895a).setOrigin(0)
    this.add.rectangle(0, counterY, width, 10, 0x8a6038).setOrigin(0)
    for (let x = 0; x < width; x += 80) {
      this.add.rectangle(x + 2, counterY + 16, 76, height - counterY - 24, 0xc69a68).setOrigin(0)
    }

    // Tábua de pizza
    this.add.circle(width / 2, counterY + 60, 70, 0xe8dcc0)
    this.add.circle(width / 2, counterY + 60, 70, 0xccbb99).setStrokeStyle(4, 0x9a7a52)

    // Pizza
    this.pizza = new Pizza(this, width / 2, counterY + 60)
    this.pizza.setScale(4)

    // Capivara chef
    this.capivara = this.add.image(width / 2, counterY + 10, 'capivara').setOrigin(0.5, 1)
    this.capivara.setScale(4.5)
  }

  private buildHUD() {
    const { width } = this.scale

    this.add.rectangle(0, 0, width, 80, 0x2e1808).setOrigin(0)
    this.add.rectangle(0, 78, width, 4, 0xc87040).setOrigin(0)

    this.scoreText = this.add.text(14, 12, 'SCORE: 0', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f5e6c8',
    })
    this.livesText = this.add.text(14, 36, '♥ ♥ ♥', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ff5a5a',
    })
    this.timerText = this.add.text(width - 14, 12, 'TEMPO: 30', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f5c060',
    }).setOrigin(1, 0)

    this.add.text(width / 2, 8, 'PEDIDO DO CLIENTE', {
      fontFamily: 'monospace', fontSize: '11px', color: '#bbbbbb',
    }).setOrigin(0.5, 0)
    this.orderContainer = this.add.container(width / 2, 48)

    this.feedbackText = this.add.text(width / 2, 300, '', {
      fontFamily: 'monospace', fontSize: '26px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20)

    this.timerEvent = this.time.addEvent({
      delay: 1000, callback: this.onTick, callbackScope: this, loop: true,
    })
  }

  private buildControls() {
    const { width, height } = this.scale
    const barY = height - 26

    this.add.rectangle(0, height - 52, width, 52, 0x1a0e04, 0.8).setOrigin(0).setDepth(15)

    const slotW = 190
    const startX = width / 2 - (ALL_INGREDIENTS.length * slotW) / 2 + slotW / 2

    ALL_INGREDIENTS.forEach((ing, i) => {
      const x = startX + i * slotW
      this.add.image(x - 64, barY, `pizza_${ing}`).setScale(1.6).setDepth(16)
      this.add.text(x - 42, barY - 16, `[${INGREDIENT_KEYS[ing]}]`, {
        fontFamily: 'monospace', fontSize: '15px', color: '#f5c060',
      }).setOrigin(0, 0).setDepth(16)
      this.add.text(x - 42, barY + 2, INGREDIENT_LABELS[ing], {
        fontFamily: 'monospace', fontSize: '11px', color: '#f5e6c8',
      }).setOrigin(0, 0).setDepth(16)
    })

    this.add.text(width - 14, barY, '[ENTER]\nEntregar', {
      fontFamily: 'monospace', fontSize: '12px', color: '#7aff7a', align: 'right',
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
      this.tweens.add({
        targets: this.capivara, scaleY: 4.1, duration: 80, yoyo: true,
        onComplete: () => this.capivara.setScale(4.5),
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
    this.livesText.setText(this.lives > 0 ? Array(this.lives).fill('♥').join(' ') : '')
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

  private showFeedback(msg: string, color: string) {
    this.feedbackText.setText(msg).setColor(color).setAlpha(1).setY(300)
    this.tweens.add({ targets: this.feedbackText, alpha: 0, y: 270, duration: 900 })
  }

  private gameOver() {
    this.timerEvent.remove()
    this.scene.start('MenuScene', { score: this.score })
  }
}
