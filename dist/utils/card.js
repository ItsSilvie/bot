"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedColorFromElement = exports.getCardBody = void 0;
const types_1 = require("../data/types");
const getCardBody = (card) => {
    const { effects, lineage, name, quote, } = card;
    const formatText = (effect, text) => {
        switch (effect) {
            case types_1.CardEffect.Banish:
                return `**Banish ${name}**${text ? ` ${text}` : ''}`;
            case types_1.CardEffect.Efficiency:
                return `**Efficiency** *(This card costs **LV** less to activate. **LV** refers to your champion's level.)*`;
            case types_1.CardEffect.Enter:
                return `**Enter Effect**:${text ? ` ${text}` : ''}`;
            case types_1.CardEffect.FastAttack:
                return `**Fast Attack** *(This attack card may be activated at Fast speed.)*`;
            case types_1.CardEffect.FloatingMemory:
                return `**Floating Memory** *(While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)*`;
            case types_1.CardEffect.Flux:
                return `**Flux** *(Discard your hand at end of turn.)*`;
            case types_1.CardEffect.Glimpse:
                return `**Glimpse LV**${text ? `. ${text}` : ''} *(To **glimpse**, look at that may cards from the top of your deck. Put any of those cards back on top or on the bottom of your deck in any order.)*`;
            case types_1.CardEffect.Inherited:
                return `**Inherited Effect**:${text ? ` ${text}` : ''} *(Whenever this champion levels up, the new champion gains this ability.)*`;
            case types_1.CardEffect.Intercept:
                return `**Intercept** *(When your champion becomes a target of an attack, you may redirect that attack to this ally.)*`;
            case types_1.CardEffect.Lineage:
                return `**${lineage} Lineage** *(${name} must be leveled from a previous level "${lineage}" champion.)*`;
            case types_1.CardEffect.MultiTarget:
                return `**Multi-Target** *(This attack targets all units a chosen opponent controls, and cannot be intercepted.)*`;
            case types_1.CardEffect.SpectralShift:
                return `**Spectral Shift** *(When you activate this card, you may pay an additional 2. If you do, banish this card as it resolves, and then return a Crux element card from your graveyard to your hand.)*`;
            case types_1.CardEffect.Stealth:
                return `**Stealth** *(This unit cannot be targeted on attack declarations unless permitted by **true sight**.)*`;
            case types_1.CardEffect.TrueSight:
                return `**True Sight** *(Attacks using this weapon can target units with stealth.)*`;
            default:
                return text;
        }
    };
    const generateEffectLine = (effect, entry) => {
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
    };
    const body = effects.reduce((strOut, entry) => (`${strOut}\n\n${generateEffectLine(...entry)}`), '');
    // return `${body}${quote ? `\n\n*${quote}*` : ''}`;
    return body;
};
exports.getCardBody = getCardBody;
const getEmbedColorFromElement = (element) => {
    switch (element) {
        case types_1.CardElement.Arcane:
            return '#19ABC9';
        case types_1.CardElement.Crux:
            return '#C28FDD';
        case types_1.CardElement.Fire:
            return '#E3462A';
        case types_1.CardElement.Normal:
        default:
            return '#111111';
        case types_1.CardElement.Water:
            return '#5FD0F8';
        case types_1.CardElement.Wind:
            return '#117C00';
    }
};
exports.getEmbedColorFromElement = getEmbedColorFromElement;
