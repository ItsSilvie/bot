export enum CardSearchDataKeys {
  CostType = "t",
  Filter = "f",
  LastUpdated = "l",
  Name = "n",
  UUID = "u",
}

export enum CardSearchFilterKeys {
  Classes = "c",
  Element = "e",
  SubTypes = "s",
  Types = "t",
}

export enum CardSearchDataValues {
  CostMemory = "m",
  CostReserve = "r",
}

export interface CardSearchData {
  [CardSearchDataKeys.CostType]: CardSearchDataValues.CostMemory | CardSearchDataValues.CostReserve;
  [CardSearchDataKeys.Filter]: {
    [CardSearchFilterKeys.Classes]?: string[];
    [CardSearchFilterKeys.Element]: string;
    [CardSearchFilterKeys.SubTypes]?: string[];
    [CardSearchFilterKeys.Types]?: string[];
  },
  [CardSearchDataKeys.LastUpdated]: string;
  [CardSearchDataKeys.Name]: string;
  [CardSearchDataKeys.UUID]: string;
}