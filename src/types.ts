export interface PricingDataCirculation {
  productId: number;
  lowPrice: number | null;
  midPrice: number | null;
  highPrice: number | null;
  marketPrice: number | null;
  directLowPrice: number | null;
  subTypeName: number;
}

export interface PricingData {
  change?: {
    prices: {
      foil?: PricingDataCirculation;
      nonFoil?: PricingDataCirculation;
    }
    type: string;
  }
  prices: {
    foil?: PricingDataCirculation;
    nonFoil: PricingDataCirculation;
  },
  updated: number;
  url: string;
}