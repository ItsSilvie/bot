import { Card, CardCost, CardEffect, CardElement, CardSpeed, CardSubtype, CardSupertype, CardType, CardVariant } from "../types";

export default [
  <Card>{
    cost: 0,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Enter, 'Draw 6 cards.'],
      [CardEffect.Inherited, 'This champion is Wind element in addition to its other elements. Wind element is permanently enabled.']
    ],
    element: CardElement.Wind,
    image: true,
    level: 0,
    name: 'Spirit of Wind',
    stats: {
      health: 10,
    },
    supertype: CardSupertype.Spirit,
    type: CardType.Champion,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Enter, 'Materialize a Weapon card from your material deck with a memory cost of 0.']
    ],
    element: CardElement.Normal,
    image: 'Lorraine Wandering Warrior',
    level: 1,
    lineage: 'Lorraine',
    name: 'Lorraine, Wandering Warrior',
    quote: '"Sleep did not honor me with its presence, so the night will be productive elsewhere."',
    stats: {
      health: 16,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Lineage, undefined],
      [CardEffect.Enter, 'Until end of turn, Lorraine\'s attacks gain +2 attack and "When this attack destroys an ally, draw a card."']
    ],
    element: CardElement.Normal,
    image: 'Lorraine Blademaster',
    level: 2,
    lineage: 'Lorraine',
    name: 'Lorraine, Blademaster',
    quote: '"Home World swordistry is like a cheat."',
    stats: {
      health: 22,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Lineage, undefined],
      [undefined, '*(Crux element is enabled)*'],
      [undefined, 'Lorraine\'s attacks gain +1 attack for each Regalia weapon card in your banishment.']
    ],
    element: CardElement.Crux,
    image: 'Lorraine Crux Knight',
    level: 3,
    lineage: 'Lorraine',
    name: 'Lorraine, Crux Knight',
    quote: '"Majestic Spirit, answer my call!"',
    stats: {
      health: 28,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Memory,
    effects: [
      [undefined, {
        isClassBonus: true,
        text: '**Remove a durability counter from Clarent:** Prevent the next 1 damage target action would deal to units you control.',
      }],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Clarent, Sword of Peace',
    quote: 'A magical sword that is disenchanted by bloodshed.',
    stats: {
      attack: 1,
      durability: 2,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Memory,
    effects: [
      [undefined, 'Whenever an opponent activates a Fire card, you may banish Fire Resonance Bauble. If you do, draw 2 cards.'],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Fire Resonance Bauble',
    quote: 'Captured perhaps, but never tamed. Its owner must always err on the side of caution.',
    subtype: CardSubtype.Bauble,
    type: CardType.RegaliaItem,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Memory,
    effects: [
      [undefined, {
        isClassBonus: true,
        text: 'Warrior\'s Longsword gets +1 attack.'
      }]
    ],
    element: CardElement.Normal,
    image: 'Warriors Longsword',
    name: 'Warrior\'s Longsword',
    quote: 'Warriors hold their lives within their two hands. Reliable weapons are neded to protect them.',
    stats: {
      attack: 1,
      durability: 2,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Enter, {
        isClassBonus: true,
        text: 'Up to one target ally you control gets +1 attack until end of turn.'
      }]
    ],
    element: CardElement.Normal,
    image: 'Commanders Blade',
    name: 'Commander\'s Blade',
    quote: 'An ornate and pristine sword used ceremoniously with great effect, though dull of edge.',
    stats: {
      attack: 1,
      durability: 1,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.TrueSight, {
        isClassBonus: true,
      }]
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Sword of Seeking',
    quote: 'The jewel on its hilt emits a faint glow when nearby hostility.',
    stats: {
      attack: 1,
      durability: 1,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Memory,
    effects: [
      [undefined, 'Whenever an ally you control dies while it is not your turn, you may banish Life Essence Amulet. If you do, draw a card.']
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Life Essence Amulet',
    quote: 'An amulat that resonates with the loss of life. It is commonly used by commanders to detect when a soldier dies in enemy territory.',
    subtype: CardSubtype.Bauble,
    type: CardType.RegaliaItem,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Enter, {
        isClassBonus: true,
        text: 'Each player reveals all cards from their memory. If a Fire card was revealed, choose a unit and deal 3 damage to it. If a Water card was revealed, draw a card. If a Wind card was revealed, target opponent banishes a card at random from their memory.',
      }]
    ],
    element: CardElement.Crux,
    image: true,
    name: 'Prismatic Edge',
    stats: {
      attack: 3,
      durability: 1,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Memory,
    effects: [
      [undefined, {
        isClassBonus: true,
        text: 'Whenever Seer\'s Sword is used for an attack, **glimpse** 1. *(To **glimpse**, look at that many cards from the top of your deck. Put any of those cards back on top or on the bottom of your deck in any order.)*',
      }]
    ],
    element: CardElement.Normal,
    image: 'Seers Sword',
    name: 'Seer\'s Sword',
    quote: 'Even simple enchantment grants great advantage.',
    stats: {
      attack: 1,
      durability: 3,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
  },
  <Card>{
    cost: 4,
    costType: CardCost.Reserve,
    effects: [
      [undefined, {
        isClassBonus: true,
        levelRestriction: '2+',
        text: 'Other allies and weapons you control get +1 attack.',
      }]
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Banner Knight',
    quote: 'Standards raised behind capable leaders often instill courage in those that march astride.',
    stats: {
      attack: 1,
      health: 3,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Ally,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'Crusader of Aesa enters the field rested.'],
      [CardEffect.Intercept, {
        isClassBonus: true,
      }]
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Crusader of Aesa',
    quote: 'Persistent, if little else.',
    stats: {
      attack: 1,
      health: 4,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Ally,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Reserve,
    element: CardElement.Wind,
    effects: [
      [CardEffect.Stealth, undefined],
      [CardEffect.Enter, 'Each opponent banishes a card at random from their memory.'],
      [undefined, 'When Dream Fairy dies, each opponent draws a card.']
    ],
    image: true,
    name: 'Dream Fairy',
    stats: {
      attack: 1,
      health: 2,
    },
    supertype: CardSupertype.Mage,
    type: CardType.Ally,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.Enter, 'You may banish 2 cards from your memory at random. If you do, your champion levels up. *(Your champion levels up into a compatible champion card from your material deck, ignoring materializing costs.)*'],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Dungeon Guide',
    quote: '"Lorem ipsum dolor sit amet."',
    stats: {
      attack: 1,
      health: 3,
    },
    supertype: CardSupertype.Mage,
    type: CardType.Ally,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.Intercept, {
        isClassBonus: true,
      }],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Esteemed Knight',
    quote: 'A knight errant whose reputation precedes him. Many have perished beneath his blade.',
    stats: {
      attack: 2,
      health: 3,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Ally,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.FloatingMemory, undefined],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Honorable Vanguard',
    quote: '"On the signal of smoke, we open the gates."',
    stats: {
      attack: 1,
      health: 2,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Ally,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Reserve,
    effects: [
      [undefined, {
        isClassBonus: true,
        text: 'At the beginning of your recollection phase, put a durability counter on target Weapon you control.',
      }],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Weaponsmith',
    quote: 'Forge-hardened masters fuel the heat of battle to the rhythms of hammers and anvils.',
    stats: {
      attack: 1,
      health: 3,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Ally,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.SpectralShift, undefined],
      [undefined, 'Draw a card.']
    ],
    element: CardElement.Crux,
    image: true,
    name: 'Crux Sight',
    quote: 'Sight beyond physical limits.',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Mage,
    type: CardType.Action,
  },
  <Card>{
    cost: 5,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.Efficiency, undefined],
      [undefined, 'Return target ally to their owner\'s hand. Draw a card.']
    ],
    element: CardElement.Wind,
    image: true,
    name: 'Disorienting Winds',
    quote: 'Not the best way to travel.',
    speed: CardSpeed.Slow,
    supertype: CardSupertype.Mage,
    type: CardType.Action,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'Allies you control get +1 health until end of turn.'],
      [CardEffect.FloatingMemory]
    ],
    element: CardElement.Wind,
    image: true,
    name: 'Favorable Winds',
    quote: 'A sudden gust to turn the tide',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Mage,
    type: CardType.Action,
  },
  <Card>{
    cost: 4,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'This card costs 2 less to activate if your champion has attacked this turn.'],
      [undefined, 'Allies you control get +1 attack until end of turn. Draw a card.']
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Inspiring Call',
    quote: '"When words don\'t reach them, lead by example." - Lorraine Allard',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Warrior,
    type: CardType.Action,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Reserve,
    element: CardElement.Normal,
    effects: [
      [CardEffect.Glimpse, 'Draw a card.'],
    ],
    image: true,
    name: 'Scry the Skies',
    quote: 'The skies hold secrets only privy to the few versed in its signs.',
    speed: CardSpeed.Slow,
    supertype: CardSupertype.Mage,
    type: CardType.Action,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'As an additional cost to activate this card, return a Sword regalia you control to your material deck.'],
      [undefined, 'Materialize a Sword card from your material deck, ignoring its materialization costs.'],
    ],
    element: CardElement.Crux,
    image: 'Spirit Blade Ascension',
    name: 'Spirit Blade: Ascension',
    quote: '"Spirit and Sword bound in harmony". - Lorraine Allard',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Warrior,
    type: CardType.Action,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'Remove all durability counters from any amount of Sword weapons you control, and then banish them. Deal damage equal to the amount of durability counters removed this way split among any amount of target units.']
    ],
    element: CardElement.Crux,
    image: 'Spirit Blade Dispersion',
    name: 'Spirit Blade: Dispersion',
    quote: 'Spirits are faithful companions to the very end.',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Warrior,
    type: CardType.Action,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'This card costs 2 less to activate if your champion has dealt damage with an attack this turn.'],
      [undefined, 'Until the end of turn, target Sword weapon gets +3 attack and "Whenever an attack involving this weapon deals damage to a champion, draw a card."']
    ],
    element: CardElement.Crux,
    image: 'Spirit Blade Infusion',
    name: 'Spirit Blade: Infusion',
    quote: 'A spirited strike never dulls.',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Warrior,
    type: CardType.Action,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Reserve,
    effects: [
      [undefined, 'As an additional cost to activate this card, return a Regalia you control to your material deck.'],
      [undefined, 'Wake your champion. Draw a card.']
    ],
    element: CardElement.Crux,
    image: 'Spirits Blessing',
    name: 'Spirit\'s Blessing',
    quote: '"With the Spirits\' favor, my weapon is restored." - Lorraine Allard',
    speed: CardSpeed.Fast,
    supertype: CardSupertype.Mage,
    type: CardType.Action,
  },
  <Card>{
    cost: 5,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.Efficiency, {
        isClassBonus: true,
      }],
      [CardEffect.MultiTarget, undefined]
    ],
    element: CardElement.Wind,
    image: true,
    name: 'Hurricane Sweep',
    stats: {
      attack: 1,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Attack,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.SpectralShift, undefined],
      [CardEffect.FastAttack, {
        isClassBonus: true,
      }]
    ],
    element: CardElement.Crux,
    image: 'Spirit Blade Ghost Strike',
    name: 'Spirit Blade: Ghost Strike',
    stats: {
      attack: 2,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Attack,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.FloatingMemory, undefined],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Savage Slash',
    quote: '"There is no such thing as grace on a battlefield." - Lorraine Allard',
    stats: {
      attack: 2,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Attack,
  },
  <Card>{
    cost: 6,
    costType: CardCost.Reserve,
    effects: [
      [CardEffect.Efficiency, {
        isClassBonus: true,
      }],
    ],
    element: CardElement.Normal,
    image: true,
    name: 'Sudden Steel',
    quote: 'A spirited strike never dulls.',
    stats: {
      attack: 5,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Attack,
  },
  <Card>{
    cost: 2,
    costType: CardCost.Reserve,
    effects: [
      [undefined, {
        isClassBonus: true,
        text: 'Wind Cutter gets +1 attack.'
      }],
      [undefined, 'Reveal a random card in your memory. If that card is Wind element, put Wind Cutter into your memory instead of the graveyard as it resolves.']
    ],
    element: CardElement.Wind,
    image: true,
    name: 'Wind Cutter',
    stats: {
      attack: 1,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Attack,
  },
];