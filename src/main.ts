import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { PreloadScene } from './scenes/PreloadScene'
import { MenuScene } from './scenes/MenuScene'
import { PizzeriaScene } from './scenes/PizzeriaScene'
import { GameScene } from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  zoom: 3,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  scene: [BootScene, PreloadScene, MenuScene, PizzeriaScene, GameScene],
}

new Phaser.Game(config)
