import { Card, CardCost, CardEffect, CardElement, CardSubtype, CardSupertype, CardType, CardVariant } from "../types";

export default [
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
    name: 'Clarent, Sword of Peace',
    notes: 'Given to all Kickstarter backers receiving a shipment',
    number: 'KS PROMO 001',
    quote: 'A magical sword that is disenchanted by bloodshed.',
    stats: {
      attack: 1,
      durability: 3,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
    variant: CardVariant.Foil,
  },
  <Card>{
    cost: 0,
    costType: CardCost.Memory,
    effects: [
      [undefined, {
        isRestedUponUse: true,
        text: '**Remove an enlighten counter from your champion:** Deal 1 damage to target unit. Activate this ability only at slow speed.'
      }]
    ],
    element: CardElement.Normal,
    name: 'Endura, Sceptre of Ignition',
    notes: 'Given to all Kickstarter backers receiving a shipment',
    number: 'KS PROMO 002',
    quote: 'Its spark glows vibrantly in colors rarely seen. Some say, its spark originates from a distant world, one that is far more ominous than here.',
    subtype: CardSubtype.Sceptre,
    supertype: CardSupertype.Mage,
    type: CardType.RegaliaItem,
    variant: CardVariant.Foil,
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
    name: 'Prismatic Edge',
    notes: 'Given to all Kickstarter backers receiving a shipment',
    number: 'KS PROMO 003',
    stats: {
      attack: 3,
      durability: 1,
    },
    subtype: CardSubtype.Sword,
    supertype: CardSupertype.Warrior,
    type: CardType.RegaliaWeapon,
    variant: CardVariant.Foil,
  },
  <Card>{
    cost: 1,
    costType: CardCost.Memory,
    effects: [
      [undefined, 'At the beginning of your recollection phase, put all cards from your memory on the bottom of your deck in any order. Then, draw that many cards.']
    ],
    element: CardElement.Arcane,
    name: 'Arcanist\'s Prism',
    notes: 'Given to all Kickstarter backers receiving a shipment',
    number: 'KS PROMO 004',
    quote: '"Such a curious thing. It seems as though it\'s alive." - Rai Koki',
    subtype: CardSubtype.Artifact,
    type: CardType.RegaliaItem,
    variant: CardVariant.Foil,
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
    level: 3,
    lineage: 'Lorraine',
    name: 'Lorraine, Crux Knight',
    notes: 'Game Store 1 and 2 tier Kickstarter backers received 1 for each Starter Deck ordered',
    number: 'KS PROMO 005',
    quote: '"Majestic Spirit, answer my call!"',
    stats: {
      health: 28,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
    variant: CardVariant.Foil,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Lineage, undefined],
      [undefined, '*(Arcane element is enabled.)*'],
      [undefined, 'Rai gets +1 level for each Arcane element mage card in your banishment.']
    ],
    element: CardElement.Arcane,
    level: 3,
    lineage: 'Rai',
    name: 'Rai, Storm Seer',
    notes: 'Game Store 1 and 2 tier Kickstarter backers received 1 for each Starter Deck ordered',
    number: 'KS PROMO 006',
    stats: {
      health: 25,
    },
    supertype: CardSupertype.Mage,
    type: CardType.Champion,
    variant: CardVariant.Foil,
  }
];