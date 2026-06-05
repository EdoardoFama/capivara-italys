import Phaser from 'phaser'

export class Capivara extends Phaser.Physics.Arcade.Sprite {
  private body!: Phaser.Physics.Arcade.Body
  private isOnGround = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 16)
    body.setMaxVelocityX(120)

    // Placeholder visual enquanto não há sprites
    this.drawPlaceholder(scene)
  }

  private drawPlaceholder(scene: Phaser.Scene) {
    const g = scene.add.graphics()
    // Corpo da capivara (marrom)
    g.fillStyle(0x8b5e3c)
    g.fillRect(-7, -8, 14, 12)
    // Cabeça
    g.fillRect(-5, -16, 10, 10)
    // Nariz
    g.fillStyle(0x5a3a1a)
    g.fillRect(-2, -10, 4, 3)
    // Chapéu de cozinheiro (branco)
    g.fillStyle(0xffffff)
    g.fillRect(-4, -22, 8, 8)
    g.fillRect(-6, -15, 12, 3)
    // Caixa de pizza
    g.fillStyle(0xe8a045)
    g.fillRect(-5, -6, 10, 6)

    const texture = scene.textures.generateTexture('capivara_placeholder', 14, 22)
    g.destroy()

    this.setTexture('capivara_placeholder')
  }

  handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const body = this.body as Phaser.Physics.Arcade.Body
    this.isOnGround = body.blocked.down

    if (cursors.left.isDown) {
      body.setVelocityX(-100)
      this.setFlipX(true)
    } else if (cursors.right.isDown) {
      body.setVelocityX(100)
      this.setFlipX(false)
    } else {
      body.setVelocityX(0)
    }

    if ((cursors.up.isDown || cursors.space?.isDown) && this.isOnGround) {
      body.setVelocityY(-220)
    }
  }
}
