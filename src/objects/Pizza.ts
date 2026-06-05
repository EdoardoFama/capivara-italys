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
  private baked = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)
    this.render()
  }

  private render() {
    this.removeAll(true)
    const dough = this.scene.add.image(0, 0, 'pizza_dough')
    if (this.baked) dough.setTint(0xe8b860)
    this.add(dough)
    this.ingredients.forEach(i => this.add(this.scene.add.image(0, 0, `pizza_${i}`)))
  }

  addIngredient(ing: Ingredient): boolean {
    if (this.ingredients.includes(ing)) return false
    this.ingredients.push(ing)
    this.render()
    return true
  }

  setIngredients(ings: Ingredient[], baked = false) {
    this.ingredients = [...ings]
    this.baked = baked
    this.render()
  }

  setBaked(baked: boolean) {
    this.baked = baked
    this.render()
  }

  getIngredients(): Ingredient[] {
    return [...this.ingredients]
  }

  isEmpty(): boolean {
    return this.ingredients.length === 0
  }

  matches(order: Ingredient[]): boolean {
    if (this.ingredients.length !== order.length) return false
    return order.every(i => this.ingredients.includes(i))
  }

  reset() {
    this.ingredients = []
    this.baked = false
    this.render()
  }
}
