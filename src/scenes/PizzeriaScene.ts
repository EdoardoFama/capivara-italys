import Phaser from 'phaser'
import {
  createTexture,
  createSpritesheet,
  CAPIVARA_IDLE,
  CAPIVARA_WALK1,
  CAPIVARA_WALK2,
  PIZZA_DOUGH,
  PIZZA_SAUCE,
  PIZZA_CHEESE,
  PEPPERONI,
  MUSHROOM,
  OVEN_FRONT,
} from '../sprites/PixelArt'
import { Pizza, type Ingredient, INGREDIENT_LABELS, INGREDIENT_KEYS } from '../objects/Pizza'

const ORDERS: Ingredient[][] = [
  ['sauce', 'cheese'],
  ['sauce', 'cheese', 'pepperoni'],
  ['sauce', 'cheese', 'mushroom'],
  ['sauce', 'pepperoni', 'mushroom'],
  ['sauce', 'cheese', 'pepperoni', 'mushroom'],
]

const ALL_INGREDIENTS: Ingredient[] = ['sauce', 'cheese', 'pepperoni', 'mushroom']

export class PizzeriaScene extends Phaser.Scene {
  private capivara!: Phaser.GameObjects.Sprite
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
  private ingredientBar!: Phaser.GameObjects.Container
  private feedbackText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'PizzeriaScene' })
  }

  create() {
    this.createTextures()
    this.buildScene()
    this.buildHUD()
    this.setupInput()
    this.nextOrder()
  }

  private createTextures() {
    createSpritesheet(this, 'capivara_sheet', [CAPIVARA_IDLE, CAPIVARA_WALK1, CAPIVARA_WALK2])
    createTexture(this, 'pizza_dough', PIZZA_DOUGH)
    createTexture(this, 'pizza_sauce', PIZZA_SAUCE)
    createTexture(this, 'pizza_cheese', PIZZA_CHEESE)
    createTexture(this, 'pizza_pepperoni', PEPPERONI)
    createTexture(this, 'pizza_mushroom', MUSHROOM)
    createTexture(this, 'oven_front', OVEN_FRONT)
  }

  private buildScene() {
    const { width, height } = this.scale

    // Fundo da cozinha
    this.add.rectangle(0, 0, width, height, 0xf5e6c8).setOrigin(0)

    // Parede de tijolos (faixa superior)
    for (let x = 0; x < width; x += 16) {
      for (let y = 40; y < 120; y += 8) {
        const offset = (Math.floor(y / 8) % 2) * 8
        this.add.rectangle(x + offset, y, 14, 6, 0xc4714a).setOrigin(0)
        this.add.rectangle(x + offset, y, 14, 6, 0x00000000)
      }
    }
    this.add.rectangle(0, 40, width, 2, 0x8a5030).setOrigin(0)
    this.add.rectangle(0, 120, width, 3, 0x8a5030).setOrigin(0)

    // Piso de azulejo italiano
    for (let x = 0; x < width; x += 24) {
      for (let y = 120; y < height; y += 24) {
        const col = (Math.floor(x / 24) + Math.floor(y / 24)) % 2
        this.add.rectangle(x, y, 23, 23, col === 0 ? 0xf5f0e8 : 0xe8dfd0).setOrigin(0)
      }
    }
    this.add.rectangle(0, 120, width, 1, 0xccbbaa).setOrigin(0)

    // Forno
    const ovenSprite = this.add.image(width - 30, 140, 'oven_front').setOrigin(0.5, 0)
    ovenSprite.setScale(2)
    this.add.text(width - 30, 132, 'Forno', {
      fontFamily: 'monospace', fontSize: '4px', color: '#5a3010'
    }).setOrigin(0.5, 1)

    // Balcão
    const counterY = height - 55
    this.add.rectangle(0, counterY, width, 55, 0xb8966a).setOrigin(0)
    this.add.rectangle(0, counterY, width, 4, 0x8a6040).setOrigin(0)
    // Detalhes do balcão
    for (let x = 0; x < width; x += 30) {
      this.add.rectangle(x, counterY + 10, 28, 18, 0xc9a87a).setOrigin(0)
    }

    // Estação de pizza no balcão
    this.add.circle(width / 2, counterY + 20, 24, 0xe8dfc8)
    this.add.circle(width / 2, counterY + 20, 24, 0xccbbaa, 0)
    this.add.text(width / 2, counterY + 2, 'PIZZA', {
      fontFamily: 'monospace', fontSize: '4px', color: '#8a6040'
    }).setOrigin(0.5)

    // Pizza object
    this.pizza = new Pizza(this, width / 2, counterY + 22)

    // Capivara
    this.anims.create({
      key: 'capi_idle',
      frames: [{ key: 'capivara_sheet', frame: 0 }],
      frameRate: 1,
      repeat: -1,
    })
    this.anims.create({
      key: 'capi_cook',
      frames: [
        { key: 'capivara_sheet', frame: 0 },
        { key: 'capivara_sheet', frame: 1 },
        { key: 'capivara_sheet', frame: 2 },
        { key: 'capivara_sheet', frame: 1 },
      ],
      frameRate: 6,
      repeat: 0,
    })

    this.capivara = this.add.sprite(width / 2, counterY - 12, 'capivara_sheet', 0)
    this.capivara.setScale(2)
    this.capivara.play('capi_idle')

    // Prateleira de ingredientes
    this.buildIngredientBar(counterY)
  }

  private buildIngredientBar(counterY: number) {
    const { width } = this.scale
    this.ingredientBar = this.add.container(0, 0)

    const startX = width / 2 - (ALL_INGREDIENTS.length * 52) / 2 + 26
    const y = counterY + 38

    ALL_INGREDIENTS.forEach((ing, i) => {
      const x = startX + i * 52
      const bg = this.add.rectangle(x, y, 48, 18, 0x7a5030).setOrigin(0.5)
      const icon = this.add.image(x - 14, y, `pizza_${ing}`).setScale(ing === 'pepperoni' || ing === 'mushroom' ? 1 : 1)
      const label = this.add.text(x + 2, y - 4, INGREDIENT_LABELS[ing], {
        fontFamily: 'monospace', fontSize: '4px', color: '#f5e6c8'
      }).setOrigin(0, 0)
      const key = this.add.text(x + 2, y + 2, `[${INGREDIENT_KEYS[ing]}]`, {
        fontFamily: 'monospace', fontSize: '4px', color: '#f5c060'
      }).setOrigin(0, 0)

      this.ingredientBar.add([bg, icon, label, key])
    })
  }

  private buildHUD() {
    const { width } = this.scale

    // Topo HUD
    this.add.rectangle(0, 0, width, 40, 0x3a2010).setOrigin(0)
    this.add.rectangle(0, 38, width, 2, 0xc87040).setOrigin(0)

    this.scoreText = this.add.text(6, 4, 'SCORE: 0', {
      fontFamily: 'monospace', fontSize: '6px', color: '#f5e6c8',
      stroke: '#1a0a00', strokeThickness: 1,
    })

    this.livesText = this.add.text(6, 14, '♥♥♥', {
      fontFamily: 'monospace', fontSize: '6px', color: '#ff5555',
    })

    this.timerText = this.add.text(width - 6, 4, 'TEMPO: 30', {
      fontFamily: 'monospace', fontSize: '6px', color: '#f5c060',
      stroke: '#1a0a00', strokeThickness: 1,
    }).setOrigin(1, 0)

    // Painel do pedido
    this.add.text(width / 2, 4, 'PEDIDO:', {
      fontFamily: 'monospace', fontSize: '5px', color: '#aaaaaa',
    }).setOrigin(0.5, 0)

    this.orderContainer = this.add.container(width / 2, 14)

    // Feedback
    this.feedbackText = this.add.text(width / 2, this.scale.height / 2 - 20, '', {
      fontFamily: 'monospace', fontSize: '10px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10)

    // Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTick,
      callbackScope: this,
      loop: true,
    })
  }

  private setupInput() {
    this.input.keyboard!.on('keydown-Q', () => this.tryAddIngredient('sauce'))
    this.input.keyboard!.on('keydown-W', () => this.tryAddIngredient('cheese'))
    this.input.keyboard!.on('keydown-E', () => this.tryAddIngredient('pepperoni'))
    this.input.keyboard!.on('keydown-R', () => this.tryAddIngredient('mushroom'))
    this.input.keyboard!.on('keydown-ENTER', () => this.submitPizza())
  }

  private tryAddIngredient(ing: Ingredient) {
    const added = this.pizza.addIngredient(ing)
    if (added) {
      this.capivara.play('capi_cook')
      this.capivara.once('animationcomplete', () => this.capivara.play('capi_idle'))
      this.showFeedback(`+${INGREDIENT_LABELS[ing]}`, '#f5e6c8')
    }
  }

  private submitPizza() {
    if (this.pizza.getIngredients().length === 0) return

    if (this.pizza.matches(this.currentOrder)) {
      const bonus = this.timerValue * 10
      this.score += 100 + bonus
      this.scoreText.setText(`SCORE: ${this.score}`)
      this.showFeedback('PERFEITA! +' + (100 + bonus), '#55ff55')
      this.time.delayedCall(1000, () => this.nextOrder())
    } else {
      this.lives--
      this.livesText.setText('♥'.repeat(Math.max(0, this.lives)))
      this.showFeedback('ERROU!', '#ff5555')
      this.pizza.reset()
      if (this.lives <= 0) {
        this.time.delayedCall(1000, () => this.gameOver())
      }
    }
  }

  private nextOrder() {
    this.pizza.reset()
    this.timerValue = 30
    this.timerText.setText('TEMPO: 30')

    this.currentOrder = Phaser.Utils.Array.GetRandom(ORDERS)
    this.updateOrderDisplay()
  }

  private updateOrderDisplay() {
    this.orderContainer.removeAll(true)
    const totalW = this.currentOrder.length * 22
    let x = -totalW / 2 + 11

    this.currentOrder.forEach(ing => {
      const icon = this.add.image(x, 0, `pizza_${ing}`)
      this.orderContainer.add(icon)
      x += 22
    })
  }

  private onTick() {
    this.timerValue--
    const color = this.timerValue <= 10 ? '#ff5555' : '#f5c060'
    this.timerText.setText(`TEMPO: ${this.timerValue}`)
    this.timerText.setColor(color)

    if (this.timerValue <= 0) {
      this.lives--
      this.livesText.setText('♥'.repeat(Math.max(0, this.lives)))
      this.showFeedback('TEMPO ESGOTADO!', '#ff8800')
      this.pizza.reset()
      if (this.lives <= 0) {
        this.time.delayedCall(1000, () => this.gameOver())
      } else {
        this.time.delayedCall(1000, () => this.nextOrder())
      }
    }
  }

  private showFeedback(msg: string, color: string) {
    this.feedbackText.setText(msg).setColor(color).setAlpha(1)
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 0,
      y: this.feedbackText.y - 15,
      duration: 900,
      onComplete: () => {
        this.feedbackText.setY(this.scale.height / 2 - 20)
      },
    })
  }

  private gameOver() {
    this.timerEvent.remove()
    this.scene.start('MenuScene', { score: this.score })
  }
}
