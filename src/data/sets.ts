import { Set } from './types';

const pnpNotes = [
  'This is from version 1.2 of the Print and Play (PnP) decks, released on 7th January 2022.',
  'The Print and Play decks can be obtained at https://grandarchivetcg.com/lorraine-pnp.pdf and https://grandarchivetcg.com/rai-pnp.pdf.'
];

export default <Set[]>[
  <Set>{
    alt: ['PnP Lorraine'],
    filename: '2021-12 PnP Lorraine Starter Deck',
    month: 12,
    name: 'PnP Lorraine Starter Deck',
    notes: pnpNotes,
    year: 2021,
  },
  <Set>{
    alt: ['PnP Rai'],
    filename: '2021-12 PnP Rai Starter Deck',
    month: 12,
    name: 'PnP Rai Starter Deck',
    notes: pnpNotes,
    year: 2021,
  },
  <Set>{
    alt: ['SAMPLE'],
    filename: '2022-01 Sample Promo',
    month: 1,
    name: 'Sample Promo',
    year: 2022,
  },
  <Set>{
    alt: ['KS PROMO'],
    filename: '2022-04 Kickstarter Promo',
    month: 4,
    name: 'Kickstarter Promo',
    year: 2022,
  },
];