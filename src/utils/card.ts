import { ColorResolvable } from "discord.js";
import { Card, CardEffect, CardEffectBody, CardEffects, CardElement, CardType } from "../data/types";

export const getCardBody: (card: Card) => string = (card) => {
  const {
    effects,
    lineage,
    name,
    quote,
  } = card;

  const formatText: (effect: CardEffect | undefined, text?: string) => string = (effect, text) => {
    switch (effect) {
      case CardEffect.Efficiency:
        return `**Efficiency** *(This card costs **LV** less to activate. **LV** refers to your champion's level.)*`;

      case CardEffect.Enter:
        return `**Enter Effect**:${text ? ` ${text}` : ''}`;

      case CardEffect.FastAttack:
        return `**Fast Attack** *(This attack card may be activated at Fast speed.)*`;

      case CardEffect.FloatingMemory:
        return `**Floating Memory** *(While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)*`;

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

    if (entry.levelRestriction) {
      output = `\`Level ${entry.levelRestriction}\` ${output}`;
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

export const getEmbedColorFromElement: (element: CardElement) => ColorResolvable = (element) => {
  switch (element) {
    case CardElement.Arcane:
      return '#19ABC9';
    
    case CardElement.Crux:
      return '#C28FDD';

    case CardElement.Fire:
      return '#E3462A';

    case CardElement.Normal:
    default:
      return '#111111';

    case CardElement.Water:
      return '#5FD0F8';

    case CardElement.Wind:
      return '#117C00';
  }
}