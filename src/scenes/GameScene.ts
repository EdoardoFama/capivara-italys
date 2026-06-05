import Phaser from 'phaser'
import { Capivara } from '../objects/Capivara'

export class GameScene extends Phaser.Scene {
  private capivara!: Capivara
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private ground!: Phaser.Physics.Arcade.StaticGroup
  private scoreText!: Phaser.GameObjects.Text
  private score = 0

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    const { width, height } = this.scale

    // Fundo
    this.add.rectangle(0, 0, width, height, 0x87ceeb).setOrigin(0)
    this.add.rectangle(0, height - 32, width, 32, 0x5d4037).setOrigin(0)
    this.add.rectangle(0, height - 20, width, 20, 0x388e3c).setOrigin(0)

    // Chão (física)
    this.ground = this.physics.add.staticGroup()
    const groundBody = this.ground.create(width / 2, height - 16, undefined) as Phaser.Physics.Arcade.Sprite
    groundBody.setVisible(false)
    groundBody.setSize(width, 32)
    groundBody.refreshBody()

    // Capivara
    this.capivara = new Capivara(this, 60, height - 40)

    // Colisão capivara com chão
    this.physics.add.collider(this.capivara, this.ground)

    // Controles
    this.cursors = this.input.keyboard!.createCursorKeys()

    // HUD
    this.scoreText = this.add.text(6, 6, 'Pizzas: 0', {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    })

    // Texto de debug de cena
    this.add
      .text(width / 2, height / 2 - 20, 'Cena do jogo carregada!', {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#333333',
      })
      .setOrigin(0.5)
  }

  update() {
    this.capivara.handleMovement(this.cursors)
  }
}
