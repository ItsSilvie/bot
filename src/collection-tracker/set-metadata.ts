export const getSetLogo = (setPrefix) => {
  switch (setPrefix) {
    case 'DOAp':
    case 'DOApSP':
      return 'DOA.png';

    default:
      return 'GA.png';
  }
}

enum SetType {
  Deck = 'deck',
  Promo = 'promo',
  Sample = 'sample',
  Standard = 'standard',
}

export const getSetInfo: (setPrefix: string) => {
  type: SetType[];
  year: number;
} = (setPrefix) => {
  switch (setPrefix) {
    case 'DEMO22':
      return {
        type: [SetType.Deck],
        year: 2022,
      }

    case 'DEMO22-SAMPLE':
      return {
        type: [SetType.Deck, SetType.Sample],
        year: 2022,
      }

    case 'DOA 1st':
      return {
        type: [SetType.Standard],
        year: 2023,
      }

    case 'DOAp':
      return {
        type: [SetType.Standard],
        year: 2023,
      }

    case 'KSP':
      return {
        type: [SetType.Promo],
        year: 2023,
      }

    case 'SAMPLE':
      return {
        type: [SetType.Sample],
        year: 2021,
      }

    case 'P22':
      return {
        type: [SetType.Promo],
        year: 2022,
      }

    default:
      throw new Error(`No set info specified for ${setPrefix}`);
  }
}

export const getSetMetadata = (setPrefix) => {
  switch (setPrefix) {
    case 'DEMO22':
      return {
        journal: 'All of the cards in this set are from boxes handed out by local game stores.',
        linked: {
          description: 'Sample decks printed on thicker card stock also exists.',
          name: 'LGS Demo 2022 (SAMPLE)',
          prefix: 'DEMO22-SAMPLE',
        }
      }

    case 'DEMO22-SAMPLE':
      return {
        journal: 'Printed on thicker card stock, these were from packs handed out at Summer 2022 conventions.',
        linked: {
          description: 'Legal to play decks printed on regular card stock also exist.',
          name: 'LGS Demo 2022',
          prefix: 'DEMO22',
        }
      }

    case 'DOAp':
      return {
        journal: 'More than half of the cards in this set come from the Lorraine and Rai Prelude Starter Decks!',
      }

    case 'SAMPLE':
      return {
        journal: 'These sample cards were given out between November 2021 and June 2022. They are not legal for play.'
      }

    default:
      return;
  }
}