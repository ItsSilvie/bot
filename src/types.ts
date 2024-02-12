export interface PricingDataCirculation {
  productId: number;
  lowPrice: number;
  midPrice: number;
  highPrice: number;
  marketPrice: number;
  directLowPrice: number | null;
  subTypeName: number;
}

export interface PricingData {
  prices: {
    foil?: PricingDataCirculation;
    nonFoil: PricingDataCirculation;
  },
  updated: number;
  url: string;
}