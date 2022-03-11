import { ColorResolvable } from "discord.js";
import { Card, CardEffect, CardEffectBody, CardEffects, CardElement, CardType, IndexCardElement } from "../data/types";

export const getCardBody: (card: Card) => string = (card) => {
  const {
    effects,
    lineage,
    name,
    quote,
  } = card;

  const formatText: (effect: CardEffect | undefined, text?: string) => string = (effect, text) => {
    switch (effect) {
      case CardEffect.Banish:
        return `**Banish ${name}**${text ? ` ${text}` : ''}`

      case CardEffect.Efficiency:
        return `**Efficiency** *(This card costs **LV** less to activate. **LV** refers to your champion's level.)*`;

      case CardEffect.Enter:
        return `**Enter Effect**:${text ? ` ${text}` : ''}`;

      case CardEffect.FastAttack:
        return `**Fast Attack** *(This attack card may be activated at Fast speed.)*`;

      case CardEffect.FloatingMemory:
        return `**Floating Memory** *(While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)*`;

      case CardEffect.Flux:
        return `**Flux** *(Discard your hand at end of turn.)*`;

      case CardEffect.Glimpse:
        return `**Glimpse LV**${text ? `. ${text}` : ''} *(To **glimpse**, look at that may cards from the top of your deck. Put any of those cards back on top or on the bottom of your deck in any order.)*`

      case CardEffect.Inherited:
        return `**Inherited Effect**:${text ? ` ${text}` : ''} *(Whenever this champion levels up, the new champion gains this ability.)*`;

      case CardEffect.Intercept:
        return `**Intercept** *(When your champion becomes a target of an attack, you may redirect that attack to this ally.)*`;

      case CardEffect.Lineage:
        return `**${lineage} Lineage** *(${name} must be leveled from a previous level "${lineage}" champion.)*`;

      case CardEffect.MultiTarget:
        return `**Multi-Target** *(This attack targets all units a chosen opponent controls, and cannot be intercepted.)*`;

      case CardEffect.SpectralShift:
        return `**Spectral Shift** *(When you activate this card, you may pay an additional 2. If you do, banish this card as it resolves, and then return a Crux element card from your graveyard to your hand.)*`;

      case CardEffect.Stealth:
        return `**Stealth** *(This unit cannot be targeted on attack declarations unless permitted by **true sight**.)*`;

      case CardEffect.TrueSight:
        return `**True Sight** *(Attacks using this weapon can target units with stealth.)*`;

      default:
        return text;
    }
  }

  const generateEffectLine: (effect: CardEffect | undefined, entry: CardEffectBody) => string = (effect, entry) => {
    if (!entry) {
      return formatText(effect);
    }

    if (typeof entry === 'string') {
      return formatText(effect, entry);
    }

    let output = formatText(effect, entry.text);

    if (entry.isRestedUponUse) {
      output = `\`Rest\` ${output}`;
    }

    if (entry.levelRestriction) {
      output = `\`Level ${entry.levelRestriction}\` ${output}`;
    }

    if (entry.isFocus) {
      output = `\`Focus\` ${output}`;
    }

    if (entry.isClassBonus) {
      output = `\`Class Bonus\` ${output}`;
    }

    return output;
  }
  
  const body = effects.reduce((strOut, entry) => (
    `${strOut}\n\n${generateEffectLine(...entry)}`
  ), '');

  // return `${body}${quote ? `\n\n*${quote}*` : ''}`;
  return body;
}

export const getEmbedColorFromElement: (element: CardElement | IndexCardElement) => ColorResolvable = (element) => {
  switch (element) {
    case CardElement.Arcane:
    case IndexCardElement.ARCANE:
      return '#19ABC9';
    
    case CardElement.Crux:
    case IndexCardElement.CRUX:
      return '#C28FDD';

    case CardElement.Fire:
    case IndexCardElement.FIRE:
      return '#E3462A';

    case CardElement.Normal:
    case IndexCardElement.NORM:
    default:
      return '#111111';

    case CardElement.Water:
    case IndexCardElement.WATER:
      return '#5FD0F8';

    case CardElement.Wind:
    case IndexCardElement.WIND:
      return '#117C00';
  }
}