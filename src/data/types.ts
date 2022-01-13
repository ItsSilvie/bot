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

export enum CardEffect {
  Enter = 'Enter Effect',
  Efficiency = 'Efficiency',
  FastAttack = 'Fast Attack',
  FloatingMemory = 'Floating Memory',
  Glimpse = 'Glimpse LV',
  Inherited = 'Inherited Effect',
  Intercept = 'Intercept',
  Lineage = 'Lineage',
  MultiTarget = 'Multi-Target',
  Stealth = 'Stealth',
  SpectralShift = 'Spectral Shift',
  TrueSight = 'True Sight',
}

export type CardEffectBody = string | {
  isClassBonus?: boolean
  levelRestriction?: number | string
  text?: string
} | undefined

export type CardEffects = [
  CardEffect | undefined,
  CardEffectBody
][]

export enum CardSpeed {
  Fast = 'Fast',
  Slow = 'Slow',
}

export type CardStats = {
  attack: number
  durability: number
  health: number
}

export enum CardSubtype {
  Artifact = 'Artifact',
  Bauble = 'Bauble',
  Book = 'Book',
  Sceptre = 'Sceptre',
  Sword = 'Sword',
}

export enum CardSupertype {
  Assassin = 'Assassin',
  Mage = 'Mage',
  Spirit = 'Spirit',
  Tamer = 'Tamer',
  Warrior = 'Warrior',
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
  cost: number
  costType: CardCost
  element: CardElement
  effects: CardEffects
  image?: boolean | string
  name: string
  notes?: string | string[]
  number?: number | string
  quote?: string
  variant?: CardVariant
} & ({
  level?: never
  lineage?: never
  speed?: never
  stats?: never
  subtype?: CardSubtype
  supertype?: CardSupertype
  type: Exclude<CardType, CardType.Action | CardType.Ally | CardType.Champion | CardType.RegaliaWeapon>
} | {
  level?: never
  lineage?: never
  speed: CardSpeed
  stats?: never
  subtype?: CardSubtype
  supertype?: CardSupertype
  type: CardType.Action
} | {
  level?: never
  lineage?: never
  speed?: never
  stats: Pick<CardStats, 'attack' | 'health'>
  subtype?: CardSubtype
  supertype?: CardSupertype
  type: CardType.Ally
} | {
  level: number
  lineage?: string
  speed?: never
  stats: Pick<CardStats, 'health'>
  subtype?: never
  supertype?: CardSupertype
  type: CardType.Champion
} | {
  level?: never
  lineage?: never
  speed?: never
  stats: Pick<CardStats, 'attack' | 'durability'>
  subtype?: CardSubtype
  supertype?: CardSupertype
  type: CardType.RegaliaWeapon
})

export type Set = {
  alt: string[]
  filename: string
  month: number
  name: string
  notes: string | string[]
  year: number
}