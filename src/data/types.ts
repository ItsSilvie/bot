export enum CardClass {
  Mage = 'Mage',
  Tamer = 'Tamer',
  Warrior = 'Warrior',
}

export enum CardSubclass {
  Artifact = 'Artifact',
  Bauble = 'Bauble',
  Book = 'Book',
  Sceptre = 'Sceptre',
  Sword = 'Sword',
}

export enum CardCost {
  Memory = 'Memory',
  Reserve = 'Reserve',
}

export enum CardElement {
  Arcane = 'Arcane',
  Crux = 'Crux',
  Fire = 'Fire',
  Normal = 'Normal',
  Water = 'Water',
  Wind = 'Wind',
}

export enum CardSpeed {
  Fast = 'Fast',
  Slow = 'Slow',
}

export type CardStats = {
  attack: Number
  durability: Number
  health: Number
}

export enum CardType {
  Action = 'Action',
  Ally = 'Ally',
  Attack = 'Attack',
  Champion = 'Champion',
  RegaliaItem = 'Regalia Item',
  RegaliaWeapon = 'Regalia Weapon',
}

export enum CardVariant {
  Foil = 'Foil',
  StarFoil = 'Star Foil',
}

export type Card = {
  cost: Number
  costType: CardCost
  element: CardElement
  name: String
  notes?: String | String[]
  number?: Number | String
  variant?: CardVariant
} & ({
  class?: CardClass
  level?: never
  lineage?: never
  speed?: never
  stats?: never
  subclass?: CardSubclass
  type: Exclude<CardType, CardType.Action | CardType.Ally | CardType.Champion | CardType.RegaliaWeapon>
} | {
  class: CardClass
  level?: never
  lineage?: never
  speed: CardSpeed
  stats?: never
  type: CardType.Action
} | {
  class: CardClass
  level?: never
  lineage?: never
  speed?: never
  stats: Pick<CardStats, 'attack' | 'health'>
  subclass?: never
  type: CardType.Ally
} | {
  class: CardClass
  level: Number
  lineage: String
  speed?: never
  stats: Pick<CardStats, 'health'>
  subclass?: never
  type: CardType.Champion
} | {
  class: CardClass
  level?: never
  lineage?: never
  speed?: never
  stats: Pick<CardStats, 'attack' | 'durability'>
  subclass: CardSubclass
  type: CardType.RegaliaWeapon
})

export type Set = {
  alt: String[]
  month: Number
  name: String
  year: Number
}