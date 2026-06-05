import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const { width, height } = this.scale

    const progressBox = this.add.graphics()
    const progressBar = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 80, height / 2 - 10, 160, 20)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xe8a045, 1)
      progressBar.fillRect(width / 2 - 78, height / 2 - 8, 156 * value, 16)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
    })

    // Assets serão carregados aqui conforme forem criados
  }

  create() {
    this.scene.start('MenuScene')
  }
}
