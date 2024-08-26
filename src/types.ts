export interface PricingDataCirculation {
  productId: number;
  lowPrice: number | null;
  midPrice: number | null;
  highPrice: number | null;
  marketPrice: number | null;
  directLowPrice: number | null;
  subTypeName: number;
}

export interface PricingHistory {
  prices: {
    foil?: PricingDataCirculation;
    nonFoil?: PricingDataCirculation;
  };
  type: string;
  updated: number;
}

export interface PricingData {
  change?: {
    prices: {
      foil?: PricingDataCirculation;
      nonFoil?: PricingDataCirculation;
    };
    type: string;
  };
  history: PricingHistory[];
  lowestPrice?: {
    price: number;
    saving: number;
    url: string;
  };
  prices: {
    foil?: PricingDataCirculation;
    nonFoil: PricingDataCirculation;
  };
  similar: {
    quantity: number;
    url: string;
  };
  updated: number;
  url: string;
}

export interface PricingEmbedVariant {
  marketPrice: string;
  lowPrice?: string;
  lowPriceChange: string;
  midPrice?: string;
  midPriceChange: string;
  highPrice?: string;
  highPriceChange: string;
}