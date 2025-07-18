"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
exports.default = [
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Enter, 'Draw 6 cards.'],
            [types_1.CardEffect.Inherited, 'This champion is Wind element in addition to its other elements. Wind element is permanently enabled.']
        ],
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        image: true,
        level: 0,
        name: 'Spirit of Wind',
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
            [types_1.CardEffect.Enter, 'Materialize a Weapon card from your material deck with a memory cost of 0.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Lorraine Wandering Warrior',
        level: 1,
        lineage: 'Lorraine',
        name: 'Lorraine, Wandering Warrior',
        quote: '"Sleep did not honor me with its presence, so the night will be productive elsewhere."',
        stats: {
            health: 16,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Champion,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Lineage, undefined],
            [types_1.CardEffect.Enter, 'Until end of turn, Lorraine\'s attacks gain +2 attack and "When this attack destroys an ally, draw a card."']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Lorraine Blademaster',
        level: 2,
        lineage: 'Lorraine',
        name: 'Lorraine, Blademaster',
        quote: '"Home World swordistry is like a cheat."',
        stats: {
            health: 22,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Champion,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Lineage, undefined],
            [undefined, '*(Crux element is enabled)*'],
            [undefined, 'Lorraine\'s attacks gain +1 attack for each Regalia weapon card in your banishment.']
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: 'Lorraine Crux Knight',
        level: 3,
        lineage: 'Lorraine',
        name: 'Lorraine, Crux Knight',
        quote: '"Majestic Spirit, answer my call!"',
        stats: {
            health: 28,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Champion,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: '**Remove a durability counter from Clarent:** Prevent the next 1 damage target action would deal to units you control.',
                }],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Clarent, Sword of Peace',
        quote: 'A magical sword that is disenchanted by bloodshed.',
        stats: {
            power: 1,
            durability: 2,
        },
        subtype: types_1.CardSubtype.Sword,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.RegaliaWeapon,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, 'Whenever an opponent activates a Fire card, you may banish Fire Resonance Bauble. If you do, draw 2 cards.'],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Fire Resonance Bauble',
        quote: 'Captured perhaps, but never tamed. Its owner must always err on the side of caution.',
        subtype: types_1.CardSubtype.Bauble,
        type: types_1.CardType.RegaliaItem,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'Warrior\'s Longsword gets +1 attack.'
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Warriors Longsword',
        name: 'Warrior\'s Longsword',
        quote: 'Warriors hold their lives within their two hands. Reliable weapons are neded to protect them.',
        stats: {
            power: 1,
            durability: 2,
        },
        subtype: types_1.CardSubtype.Sword,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.RegaliaWeapon,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Enter, {
                    isClassBonus: true,
                    text: 'Up to one target ally you control gets +1 attack until end of turn.'
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Commanders Blade',
        name: 'Commander\'s Blade',
        quote: 'An ornate and pristine sword used ceremoniously with great effect, though dull of edge.',
        stats: {
            power: 1,
            durability: 1,
        },
        subtype: types_1.CardSubtype.Sword,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.RegaliaWeapon,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.TrueSight, {
                    isClassBonus: true,
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Sword of Seeking',
        quote: 'The jewel on its hilt emits a faint glow when nearby hostility.',
        stats: {
            power: 1,
            durability: 1,
        },
        subtype: types_1.CardSubtype.Sword,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.RegaliaWeapon,
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
        cost: 2,
        costType: types_1.CardCost.Memory,
        effects: [
            [types_1.CardEffect.Enter, {
                    isClassBonus: true,
                    text: 'Each player reveals all cards from their memory. If a Fire card was revealed, choose a unit and deal 3 damage to it. If a Water card was revealed, draw a card. If a Wind card was revealed, target opponent banishes a card at random from their memory.',
                }]
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: true,
        name: 'Prismatic Edge',
        stats: {
            power: 3,
            durability: 1,
        },
        subtype: types_1.CardSubtype.Sword,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.RegaliaWeapon,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Memory,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'Whenever Seer\'s Sword is used for an attack, **glimpse** 1. *(To **glimpse**, look at that many cards from the top of your deck. Put any of those cards back on top or on the bottom of your deck in any order.)*',
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: 'Seers Sword',
        name: 'Seer\'s Sword',
        quote: 'Even simple enchantment grants great advantage.',
        stats: {
            power: 1,
            durability: 3,
        },
        subtype: types_1.CardSubtype.Sword,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.RegaliaWeapon,
    },
    {
        cost: 4,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    levelRestriction: '2+',
                    text: 'Other allies and weapons you control get +1 attack.',
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Banner Knight',
        quote: 'Standards raised behind capable leaders often instill courage in those that march astride.',
        stats: {
            power: 1,
            health: 3,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Ally,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'Crusader of Aesa enters the field rested.'],
            [types_1.CardEffect.Intercept, {
                    isClassBonus: true,
                }]
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Crusader of Aesa',
        quote: 'Persistent, if little else.',
        stats: {
            power: 1,
            health: 4,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Ally,
    },
    {
        cost: 3,
        costType: types_1.CardCost.Reserve,
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        effects: [
            [types_1.CardEffect.Stealth, undefined],
            [types_1.CardEffect.Enter, 'Each opponent banishes a card at random from their memory.'],
            [undefined, 'When Dream Fairy dies, each opponent draws a card.']
        ],
        image: true,
        name: 'Dream Fairy',
        stats: {
            power: 1,
            health: 2,
        },
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Ally,
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
        cost: 3,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Intercept, {
                    isClassBonus: true,
                }],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Esteemed Knight',
        quote: 'A knight errant whose reputation precedes him. Many have perished beneath his blade.',
        stats: {
            power: 2,
            health: 3,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Ally,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.FloatingMemory, undefined],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Honorable Vanguard',
        quote: '"On the signal of smoke, we open the gates."',
        stats: {
            power: 1,
            health: 2,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Ally,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'At the beginning of your recollection phase, put a durability counter on target Weapon you control.',
                }],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Weaponsmith',
        quote: 'Forge-hardened masters fuel the heat of battle to the rhythms of hammers and anvils.',
        stats: {
            power: 1,
            health: 3,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Ally,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.SpectralShift, undefined],
            [undefined, 'Draw a card.']
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: true,
        name: 'Crux Sight',
        quote: 'Sight beyond physical limits.',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 5,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Efficiency, undefined],
            [undefined, 'Return target ally to their owner\'s hand. Draw a card.']
        ],
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        image: true,
        name: 'Disorienting Winds',
        quote: 'Not the best way to travel.',
        speed: types_1.CardSpeed.Slow,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'Allies you control get +1 health until end of turn.'],
            [types_1.CardEffect.FloatingMemory]
        ],
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        image: true,
        name: 'Favorable Winds',
        quote: 'A sudden gust to turn the tide',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 4,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'This card costs 2 less to activate if your champion has attacked this turn.'],
            [undefined, 'Allies you control get +1 attack until end of turn. Draw a card.']
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Inspiring Call',
        quote: '"When words don\'t reach them, lead by example." - Lorraine Allard',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Warrior,
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
        cost: 1,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'As an additional cost to activate this card, return a Sword regalia you control to your material deck.'],
            [undefined, 'Materialize a Sword card from your material deck, ignoring its materialization costs.'],
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: 'Spirit Blade Ascension',
        name: 'Spirit Blade: Ascension',
        quote: '"Spirit and Sword bound in harmony". - Lorraine Allard',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Action,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'Remove all durability counters from any amount of Sword weapons you control, and then banish them. Deal damage equal to the amount of durability counters removed this way split among any amount of target units.']
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: 'Spirit Blade Dispersion',
        name: 'Spirit Blade: Dispersion',
        quote: 'Spirits are faithful companions to the very end.',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Action,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'This card costs 2 less to activate if your champion has dealt damage with an attack this turn.'],
            [undefined, 'Until the end of turn, target Sword weapon gets +3 attack and "Whenever an attack involving this weapon deals damage to a champion, draw a card."']
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: 'Spirit Blade Infusion',
        name: 'Spirit Blade: Infusion',
        quote: 'A spirited strike never dulls.',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Action,
    },
    {
        cost: 1,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, 'As an additional cost to activate this card, return a Regalia you control to your material deck.'],
            [undefined, 'Wake your champion. Draw a card.']
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: 'Spirits Blessing',
        name: 'Spirit\'s Blessing',
        quote: '"With the Spirits\' favor, my weapon is restored." - Lorraine Allard',
        speed: types_1.CardSpeed.Fast,
        supertype: types_1.CardSupertype.Mage,
        type: types_1.CardType.Action,
    },
    {
        cost: 5,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Efficiency, {
                    isClassBonus: true,
                }],
            [types_1.CardEffect.MultiTarget, undefined]
        ],
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        image: true,
        name: 'Hurricane Sweep',
        stats: {
            power: 1,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Attack,
    },
    {
        cost: 0,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.SpectralShift, undefined],
            [types_1.CardEffect.FastAttack, {
                    isClassBonus: true,
                }]
        ],
        element: types_1.CardElement.Crux,
        elements: [types_1.CardElement.Crux],
        image: 'Spirit Blade Ghost Strike',
        name: 'Spirit Blade: Ghost Strike',
        stats: {
            power: 2,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Attack,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.FloatingMemory, undefined],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Savage Slash',
        quote: '"There is no such thing as grace on a battlefield." - Lorraine Allard',
        stats: {
            power: 2,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Attack,
    },
    {
        cost: 6,
        costType: types_1.CardCost.Reserve,
        effects: [
            [types_1.CardEffect.Efficiency, {
                    isClassBonus: true,
                }],
        ],
        element: types_1.CardElement.Normal,
        elements: [types_1.CardElement.Normal],
        image: true,
        name: 'Sudden Steel',
        quote: 'A spirited strike never dulls.',
        stats: {
            power: 5,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Attack,
    },
    {
        cost: 2,
        costType: types_1.CardCost.Reserve,
        effects: [
            [undefined, {
                    isClassBonus: true,
                    text: 'Wind Cutter gets +1 attack.'
                }],
            [undefined, 'Reveal a random card in your memory. If that card is Wind element, put Wind Cutter into your memory instead of the graveyard as it resolves.']
        ],
        element: types_1.CardElement.Wind,
        elements: [types_1.CardElement.Wind],
        image: true,
        name: 'Wind Cutter',
        stats: {
            power: 1,
        },
        supertype: types_1.CardSupertype.Warrior,
        type: types_1.CardType.Attack,
    },
];
