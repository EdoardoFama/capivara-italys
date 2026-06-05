import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0)

    this.add
      .text(width / 2, height / 2 - 40, "Capivara Italy's", {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#e8a045',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height / 2 - 20, '🍕 Pizza Delivery', {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    const startText = this.add
      .text(width / 2, height / 2 + 10, '[ PRESSIONE ENTER ]', {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#aaaaaa',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
    })

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('GameScene')
    })

    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
  }
}
