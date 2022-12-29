export const getRarityCodeFromRarityId = (rarityId) => {
  if (rarityId < 1 || rarityId > 9) {
    throw new Error(`Unhandled rarity ID: ${rarityId}`);
  }

  const rarityArr = [
    'C', // 1
    'U', // 2
    'R', // 3
    'SR', // 4
    'UR', // 5
    'PR', // 6
    'CSR', // 7
    'CUR', // 8
    'CPR', // 9
  ];

  return rarityArr[rarityId - 1];
}

export enum Rarity {
  'C' = 'Common',
  'U' = 'Uncommon',
  'R' = 'Rare',
  'SR' = 'Super Rare',
  'UR' = 'Ultra Rare',
  'PR' = 'Promotional Rare',
  'CSR' = 'Collector Super Rare',
  'CUR' = 'Collector Ultra Rare',
  'CPR' = 'Collector Promo Rare',
}