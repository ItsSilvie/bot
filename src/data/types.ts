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
  Banish = 'Banish',
  Efficiency = 'Efficiency',
  Enter = 'Enter Effect',
  FastAttack = 'Fast Attack',
  FloatingMemory = 'Floating Memory',
  Flux = 'Flux',
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
  isFocus?: boolean
  isRestedUponUse?: boolean
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
  Cleric = 'Cleric',
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
  effects?: CardEffects
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

export type Help = {
  name: string
  description: string
}

export type Link = {
  name: string
  url: string
}

export type Set = {
  alt: string[]
  filename: string
  month: number
  name: string
  notes: string | string[]
  year: number
}

export type IndexCirculation = {
  foil: boolean
  name: string
  population: number
  population_operator: string
  uuid: string
}

export type IndexEdition = {
  card_id: string
  circulationTemplates: IndexCirculation[]
  collector_number: string
  effect: null
  flavor: null
  illustrator: string
  rarity: number
  set: IndexSet
  slug: string
  uuid: string
}

export enum IndexCardElement {
  ARCANE = 'Arcane',
  CRUX = 'Crux',
  FIRE = 'Fire',
  NORM = 'Normal',
  WATER = 'Water',
  WIND = 'Wind',
}

export type IndexCard = {
  attack: number | null
  classes: string[] | null
  cost_memory: number | null
  cost_reserve: number | null
  default_edition_id: string | null
  durability: number | null
  editions: IndexEdition[]
  effect: string
  effect_raw: string
  element: keyof IndexCardElement
  flavor: string
  level: number | null
  life: number | null
  name: string
  related_ids: null
  result_editions: IndexEdition[]
  rule: IndexRule[] | null;
  slug: string
  speed: string | null
  subtypes: string[] | null
  types: string[] | null
  uuid: string
}

export type IndexRule = {
  date_added: string
  description: string
  title?: string
}

export type IndexSet = {
  language: string
  name: string
  prefix: string
}