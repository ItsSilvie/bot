export enum CardClass {
  Mage = 'Mage',
  Tamer = 'Tamer',
  Warrior = 'Warrior',
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
  attack?: Number
  durability?: Number
  health?: Number
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
  class: CardClass
  cost: Number
  costType: CardCost
  element: CardElement
  name: String
  number?: Number | String
  variant?: CardVariant
} & ({
  level?: never
  lineage?: never
  speed?: never
  stats?: never
  type: Exclude<CardType, CardType.Action | CardType.Ally | CardType.Champion | CardType.RegaliaWeapon>
} | {
  level?: never
  lineage?: never
  speed: CardSpeed
  stats?: never
  type: CardType.Action
} | {
  level?: never
  lineage?: never
  speed?: never
  stats: Pick<CardStats, 'attack' | 'health'>
  type: CardType.Ally
} | {
  level: Number
  lineage: String
  speed?: never
  stats: Pick<CardStats, 'health'>
  type: CardType.Champion
} | {
  level?: never
  lineage?: never
  speed?: never
  stats: Pick<CardStats, 'attack' | 'durability'>
  type: CardType.RegaliaWeapon
})

export type Set = {
  alt: String[]
  month: Number
  name: String
  year: Number
}