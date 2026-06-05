import Phaser from 'phaser'

export class Capivara extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'capivara_placeholder')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const arcadeBody = this.body as Phaser.Physics.Arcade.Body
    arcadeBody.setSize(14, 16)
    arcadeBody.setMaxVelocityX(120)

    this.drawPlaceholder(scene)
  }

  private drawPlaceholder(scene: Phaser.Scene) {
    if (scene.textures.exists('capivara_placeholder')) return

    const canvas = document.createElement('canvas')
    canvas.width = 14
    canvas.height = 22
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#8b5e3c'
    ctx.fillRect(0, 10, 14, 12)
    ctx.fillRect(2, 4, 10, 10)
    ctx.fillStyle = '#5a3a1a'
    ctx.fillRect(4, 7, 6, 3)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(3, 0, 8, 7)
    ctx.fillRect(1, 5, 12, 3)
    ctx.fillStyle = '#e8a045'
    ctx.fillRect(2, 10, 10, 6)

    scene.textures.addCanvas('capivara_placeholder', canvas)
  }

  handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const arcadeBody = this.body as Phaser.Physics.Arcade.Body
    const onGround = arcadeBody.blocked.down

    if (cursors.left.isDown) {
      arcadeBody.setVelocityX(-100)
      this.setFlipX(true)
    } else if (cursors.right.isDown) {
      arcadeBody.setVelocityX(100)
      this.setFlipX(false)
    } else {
      arcadeBody.setVelocityX(0)
    }

    if ((cursors.up.isDown || cursors.space?.isDown) && onGround) {
      arcadeBody.setVelocityY(-220)
    }
  }
}
