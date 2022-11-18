const nonIndexSets = [];

const SAMPLE_CMT = {
  language: 'EN',
  name: 'Camelot (SAMPLE)',
  prefix: 'CMT',
}

nonIndexSets.push([
  SAMPLE_CMT,
  {
    cardData: [{
      // Lorraine, Wandering Warrior (non-foil)
      editions: [{
        card_id: 'sample-cmt-013',
        circulationTemplates: [{
          foil: false,
          name: 'CMT-013',
          population: 300,
          population_operator: '≈',
          printing: 'false',
          uuid: 'sample-cmt-013',
        }],
        circulations: [],
        collector_number: '013',
        set: SAMPLE_CMT,
        uuid: 'cmt-013',
      }],
      name: 'Lorraine, Wandering Warrior',
      uuid: 'cmt-013',
    }, {
      // Lorraine, Wandering Warrior (oil foil)
      editions: [{
        card_id: 'sample-cmt-013-oil',
        circulationTemplates: [{
          foil: true,
          foilType: 'oil',
          name: 'CMT-013',
          population: 150,
          population_operator: '≈',
          printing: 'false',
          uuid: 'sample-cmt-013-oil',
        }],
        circulations: [],
        collector_number: '013',
        set: SAMPLE_CMT,
        uuid: 'cmt-013-oil',
      }],
      name: 'Lorraine, Wandering Warrior',
      uuid: 'cmt-013-oil',
    }, {
      // Lorraine, Wandering Warrior (matte foil)
      editions: [{
        card_id: 'sample-cmt-013-matte',
        circulationTemplates: [{
          foil: true,
          foilType: 'matte',
          name: 'CMT-013',
          population: 150,
          population_operator: '≈',
          printing: 'false',
          uuid: 'sample-cmt-013-matte',
        }],
        circulations: [],
        collector_number: '013',
        set: SAMPLE_CMT,
        uuid: 'cmt-013-matte',
      }],
      name: 'Lorraine, Wandering Warrior',
      uuid: 'cmt-013-matte',
    }],
    isSample: true,
  }
])

export default nonIndexSets;