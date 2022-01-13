import { Card, CardCost, CardElement, CardSupertype, CardType, CardVariant } from "../types";

export default [
  <Card>{
    cost: 3,
    costType: CardCost.Memory,
    element: CardElement.Normal,
    level: 3,
    lineage: 'Lorraine',
    name: 'Lorraine, Wandering Warrior',
    notes: [
      'Given to all Champion, Grand Champion, and Designer tier Kickstarter backers + 100 random Kickstarter backers',
      'Handed out in giveaway competitions on Discord and through content creators'
    ],
    number: 'SAMPLE PROMO 000',
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
    element: CardElement.Normal,
    level: 3,
    lineage: 'Lorraine',
    name: 'Lorraine, Wandering Warrior',
    notes: 'Handed out in giveaway competitions on Discord and through content creators',
    number: 'SAMPLE PROMO 000',
    stats: {
      health: 25,
    },
    supertype: CardSupertype.Warrior,
    type: CardType.Champion,
    variant: CardVariant.StarFoil,
  }
];