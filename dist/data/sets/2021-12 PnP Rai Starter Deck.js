"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
exports.default = [
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Enter, 'Draw 6 cards.'],
            [types_1.CardEffect.Inherited, 'This champion is Fire element in addition to its other elements. Fire element is permanently enabled.']
        ],
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        image: true,
        level: 0,
        name: 'Spirit of Fire',
        stats: {
            health: 10,
        },
        supertype: types_1.CardSupertype.Spirit,
        type: types_1.CardType.Champion,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Enter, 'Put 2 **enlighten** counters on Rai. *(As a fast action, you may remove 3 **enlighten** counters from your champion to draw a card.)*.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Rai Spellcrafter',
        level: 1,
        lineage: 'Rai',
        name: 'Rai, Spellcrafter',
        quote: '"A new world means new exciting magic at my fingertips."',
        stats: {
            health: 15,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Champion,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Lineage, undefined],
            [types_1.CardEffect.Inherited, 'Whenever you activate your first Mage action of each turn, put an **enlighten** counter on this champion.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Rai Archmage',
        level: 2,
        lineage: 'Rai',
        name: 'Rai, Archmage',
        stats: {
            health: 20,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Champion,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Lineage, undefined],
            [undefined, '*(Arcane element is enabled.)*'],
            [undefined, 'Rai gets +1 level for each Arcane element mage card in your banishment.']
        ],
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        image: 'Rai Storm Seer',
        level: 3,
        lineage: 'Rai',
        name: 'Rai, Storm Seer',
        stats: {
            health: 25,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Champion,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, {
                    isRestedUponUse: true,
                    text: '**Remove an enlighten counter from your champion:** Deal 1 damage to target unit. Activate this ability only at slow speed.'
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Endura Sceptre of Ignition',
        name: 'Endura, Sceptre of Ignition',
        quote: 'Its spark glows vibrantly in colors rarely seen. Some say, its spark originates from a distant world, one that is far more ominous than here.',
        subtype: types_1.CardSubtype.Sceptre,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, 'Whenever an opponent activates a Wind card, you may banish Wind Resonance Bauble. If you do, draw 2 cards.'],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Wind Resonance Bauble',
        quote: 'A spirit of wind sleeps within this artifact. Perhaps it will grant blessings once it wakes.',
        subtype: types_1.CardSubtype.Bauble,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'Your champion gets +1 level.'
                }],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Tome of Knowledge',
        quote: 'Mana provided, a mage\'s book amplifies one\'s potential. Otherwise, it makes for good kindling.',
        subtype: types_1.CardSubtype.Book,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, 'When your opponent attacks with a unit, if it was the third time they\'ve attacked with a unit this turn, you may banish Surveillance Stone. If you do, draw a card.'],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Surveillance Stone',
        quote: 'A magical alarm device unsuitable for common homes. Indispensible for a palace treasury.',
        subtype: types_1.CardSubtype.Bauble,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, 'You may not remove **enlighten** counters from your champion to pay for costs.'],
            [types_1.CardEffect.Banish, 'Draw a card. Activate this ability only if your champion has 6 or more **enlighten** counters on them.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Mana Limiter',
        quote: 'A valuable training tool for young students.',
        subtype: types_1.CardSubtype.Bauble,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, 'Whenever an ally you control dies while it is not your turn, you may banish Life Essence Amulet. If you do, draw a card.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Life Essence Amulet',
        quote: 'An amulat that resonates with the loss of life. It is commonly used by commanders to detect when a soldier dies in enemy territory.',
        subtype: types_1.CardSubtype.Bauble,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Banish, 'Your champion gets +2 levels until end of turn.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Bauble of Empowerment',
        quote: 'Mages often store their excess mana into such crystals. If used by even a novice mage, one might mistake them as far greater.',
        subtype: types_1.CardSubtype.Bauble,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, 'At the beginning of your recollection phase, put all cards from your memory on the bottom of your deck in any order. Then, draw that many cards.']
        ],
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        image: 'Arcanists Prism',
        name: 'Arcanist\'s Prism',
        quote: '"Such a curious thing. It seems as though it\'s alive." - Rai Koki',
        subtype: types_1.CardSubtype.Artifact,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        image: true,
        name: 'Blitz Mage',
        quote: '"Reckless mages. They should think before they act!" - Rai Koki',
        stats: {
            power: 3,
            health: 1,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        effects: [
            [undefined, 'Your champion gets +1 level until end of turn.'],
            [undefined, 'Draw a card.']
        ],
        image: true,
        name: 'Arcane Sight',
        quote: '"If only you could see what I see, Lorraine. Even you might abandon the sword." - Rai Koki',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 11,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        effects: [
            [types_1.CardEffect.Efficiency, undefined],
            [undefined, 'Deal 11 damage to target champion.']
        ],
        image: true,
        name: 'Arcane Blast',
        quote: 'Manifesting such chaotic mana is only possible for those who are at the pinnacle of magic.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Enter, 'You may banish 2 cards from your memory at random. If you do, your champion levels up. *(Your champion levels up into a compatible champion card from your material deck, ignoring materializing costs.)*'],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Dungeon Guide',
        quote: '"Lorem ipsum dolor sit amet."',
        stats: {
            power: 1,
            health: 3,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        effects: [
            [undefined, 'Deal 1 damage to target unit.'],
            [types_1.CardEffect.FloatingMemory, {
                    isClassBonus: true,
                }]
        ],
        image: true,
        name: 'Ignite the Soul',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'Whenever Impassioned Tutor attacks, your champion gains +1 level until end of turn.']
        ],
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        image: true,
        name: 'Impassioned Tutor',
        quote: 'Instruction through fiery passion.',
        stats: {
            power: 1,
            health: 3,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Intercept, undefined],
            [undefined, 'When Library Witch dies, draw a card.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Library Witch',
        quote: 'The studious ones at the academy have little patience for distractions. However, they are willing to help those in need.',
        stats: {
            power: 0,
            health: 1,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'Your champion gets +1 level.'],
            [undefined, {
                    isClassBonus: true,
                    text: 'When Magus Disciple dies, draw a card.'
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Magus Disciple',
        quote: '"Harness mana! Divert it to the archmage!"',
        stats: {
            power: 1,
            health: 1,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Intercept, undefined],
            [undefined, '**Remove 2 enlighten counters from your champion:** The next time damage would be dealt to Barrier Servant this turn, prevent that damage.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Barrier Servant',
        quote: '"Do not worry. I will protect you."',
        stats: {
            power: 2,
            health: 2,
        },
        subtype: types_1.CardSubtype.Cleric,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
    },
    {
        cost: 4,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        effects: [
            [undefined, 'Deal 3 damage to all allies. **Class Bonus:** Deal 4 damage to all allies instead.']
        ],
        image: true,
        name: 'Anger the Skies',
        quote: 'Those beneath darkened clouds can do little once the raucous thundering begins.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        effects: [
            [types_1.CardEffect.Flux, undefined],
            [undefined, 'Draw 2 cards.'],
            [undefined, {
                    isClassBonus: true,
                    text: 'Draw a card.'
                }]
        ],
        image: true,
        name: 'Arcane Disposition',
        quote: 'Harnessing arcane power requires great finesse.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 8,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        effects: [
            [types_1.CardEffect.Efficiency, undefined],
            [undefined, 'Put 5 **enlighten** counters on your champion. *(As a fast action, you may remove 3 **enlighten** counters from your champion to draw a card.)*']
        ],
        image: true,
        name: 'Careful Study',
        quote: 'Only with knowledge is power nurtured.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        effects: [
            [undefined, 'Draw 2 cards, then discard a card.'],
            [undefined, {
                    isClassBonus: true,
                    text: 'If a Fire card was discarded by Creative Shock, you may choose a unit and deal 2 damage to it.',
                }]
        ],
        image: true,
        name: 'Creative Shock',
        quote: 'Fire mages must tread carefully.',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'This card costs 1 less to activate.',
                }],
            [undefined, 'Deal 1+**LV** damage to target unit. *(**LV** refers to your champion\'s level.)*']
        ],
        image: true,
        name: 'Fireball',
        quote: 'A basic fire spell. Deadly when mastered.',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        effects: [
            [undefined, {
                    isClassBonus: true,
                    isFocus: true,
                    text: 'This card costs 2 less to activate.',
                }],
            [undefined, 'Deal 4 damage to target ally.']
        ],
        image: true,
        name: 'Focused Flames',
        quote: 'Little withstands such concentrated heat.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 4,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        effects: [
            [undefined, 'Put 2+**LV enlighten** counters on your champion. *(**LV** refers to your champion\'s level. As a fast action, you may remove 3 **enlighten** counters from your champion to draw a card.)*.']
        ],
        image: true,
        name: 'Peer Into Mana',
        quote: '"Mana works all the same in this world. Maybe it\'s what connects all of this together." - Rai Koki',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        effects: [
            [undefined, 'Remove any amount of **enlighten** counters from your champion. Your champion gets +1 level for each counter removed this way until end of turn.']
        ],
        image: true,
        name: 'Power Overwhelming',
        quote: 'Power without semblance of subtlety. One would do well to discard notions of escaping unscathed when battling a full-fledged arcanist.',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 7,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Fire,
        elements: [types_1.CardElement.Fire],
        effects: [
            [types_1.CardEffect.Efficiency, undefined],
            [undefined, 'Deal 2 damage to all units beside your champion. **Class Bonus:** Deal 3 damage to those units instead.']
        ],
        image: true,
        name: 'Purge in Flames',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        effects: [
            [types_1.CardEffect.Glimpse, 'Draw a card.'],
        ],
        image: true,
        name: 'Scry the Skies',
        quote: 'The skies hold secrets only privy to the few versed in its signs.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Arcane,
        elements: [types_1.CardElement.Arcane],
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'This card costs 2 less to activate.',
                }],
            [undefined, 'The next time damage would be dealt to your champion this turn, prevent that damage, then put an amount of **enlighten** counters on your champion equal to the amount of damage prevented this way.']
        ],
        image: 'Spellshield Arcane',
        name: 'Spellshield: Arcane',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
];
