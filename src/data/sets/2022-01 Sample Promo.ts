import { Card, CardClass, CardCost, CardElement, CardType, CardVariant } from "../types";

export default <Card[]>[{
  class: CardClass.Warrior,
  cost: 3,
  costType: CardCost.Memory,
  element: CardElement.Normal,
  level: 3,
  lineage: 'Lorraine',
  name: 'Lorraine, Wandering Warrior',
  number: 'SAMPLE PROMO 000',
  stats: {
    health: 25,
  },
  type: CardType.Champion,
  variant: CardVariant.Foil,
}, {
  class: CardClass.Warrior,
  cost: 3,
  costType: CardCost.Memory,
  element: CardElement.Normal,
  level: 3,
  lineage: 'Lorraine',
  name: 'Lorraine, Wandering Warrior',
  number: 'SAMPLE PROMO 000',
  stats: {
    health: 25,
  },
  type: CardType.Champion,
  variant: CardVariant.StarFoil,
}];