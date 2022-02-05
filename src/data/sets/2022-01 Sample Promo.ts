import { Card, CardCost, CardEffect, CardElement, CardSupertype, CardType, CardVariant } from "../types";

export default [
  <Card>{
    cost: 3,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Enter, 'You may give each opponent a gift. If you do, all players win the game.']
    ],
    element: CardElement.Normal,
    level: 3,
    lineage: 'Lorraine',
    name: 'Lorraine, Festive Night',
    notes: [
      'Given to all Champion, Grand Champion, and Designer tier Kickstarter backers + 100 random Kickstarter backers',
      'Handed out in giveaway competitions on Discord and through content creators'
    ],
    number: 'SAMPLE PROMO 000',
    quote: 'Maybe it\'s alright to settle down and enjoy the festivities once in a while.',
    stats: {
      health: 25,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
    variant: CardVariant.Foil,
  },
  <Card>{
    cost: 3,
    costType: CardCost.Memory,
    effects: [
      [CardEffect.Enter, 'You may give each opponent a gift. If you do, all players win the game.']
    ],
    element: CardElement.Normal,
    level: 3,
    lineage: 'Lorraine',
    name: 'Lorraine, Festive Night',
    notes: 'Handed out in giveaway competitions on Discord and through content creators',
    number: 'SAMPLE PROMO 000',
    quote: 'Maybe it\'s alright to settle down and enjoy the festivities once in a while.',
    stats: {
      health: 25,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
    variant: CardVariant.StarFoil,
  }
];