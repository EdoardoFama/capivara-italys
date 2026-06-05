import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  init(data: { score?: number }) {
    this.lastScore = data.score
  }

  private lastScore?: number

  create() {
    const { width, height } = this.scale

    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0)

    // Estrelas de fundo
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)
      this.add.circle(x, y, 1, 0xffffff, Phaser.Math.FloatBetween(0.3, 0.9))
    }

    this.add.text(width / 2, height / 2 - 50, "Capivara Italy's", {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#e8a045',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 - 30, 'A Melhor Pizza da Capivara', {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#cccccc',
    }).setOrigin(0.5)

    if (this.lastScore !== undefined) {
      this.add.text(width / 2, height / 2 - 10, `Pontuacao: ${this.lastScore}`, {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#f5c060',
      }).setOrigin(0.5)
    }

    this.add.text(width / 2, height / 2 + 8, 'ENTER  Pizzaria', {
      fontFamily: 'monospace', fontSize: '5px', color: '#ffffff',
    }).setOrigin(0.5)

    const startText = this.add.text(width / 2, height / 2 + 22, '[ PRESSIONE ENTER ]', {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#aaaaaa',
    }).setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
    })

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('PizzeriaScene')
    })

    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('PizzeriaScene')
    })
  }
}
