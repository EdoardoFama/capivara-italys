import Phaser from 'phaser'

export type Ingredient = 'sauce' | 'cheese' | 'pepperoni' | 'mushroom'

export const INGREDIENT_LABELS: Record<Ingredient, string> = {
  sauce:     'Molho',
  cheese:    'Queijo',
  pepperoni: 'Peperoni',
  mushroom:  'Cogumelo',
}

export const INGREDIENT_KEYS: Record<Ingredient, string> = {
  sauce:     'Q',
  cheese:    'W',
  pepperoni: 'E',
  mushroom:  'R',
}

export class Pizza extends Phaser.GameObjects.Container {
  private ingredients: Ingredient[] = []
  private doughSprite!: Phaser.GameObjects.Image
  private ingredientSprites: Phaser.GameObjects.Image[] = []

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)

    this.doughSprite = scene.add.image(0, 0, 'pizza_dough')
    this.add(this.doughSprite)
  }

  addIngredient(ing: Ingredient): boolean {
    if (this.ingredients.includes(ing)) return false
    this.ingredients.push(ing)

    const sprite = this.scene.add.image(0, 0, `pizza_${ing}`)
    this.ingredientSprites.push(sprite)
    this.add(sprite)
    return true
  }

  getIngredients(): Ingredient[] {
    return [...this.ingredients]
  }

  matches(order: Ingredient[]): boolean {
    if (this.ingredients.length !== order.length) return false
    return order.every(i => this.ingredients.includes(i))
  }

  reset() {
    this.ingredientSprites.forEach(s => s.destroy())
    this.ingredientSprites = []
    this.ingredients = []
  }
}
