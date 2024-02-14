import { PricingData } from "../types";
import { API_URL } from "./commands";
import * as dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTimePlugin);

export const getPricingData = async (editionUUID: string, condensed: boolean | undefined) => {
  let pricingData: PricingData | undefined = undefined;

  try {				
    const queryParams = new URLSearchParams({
      id: editionUUID,
      history: 'daily',
    });

    const apiPricingData = await fetch(`${API_URL}/api/pricing?${queryParams.toString()}`)
      .then(res => res.json())

    if (apiPricingData && !apiPricingData.error && Object.keys(apiPricingData).length > 0) {
      pricingData = apiPricingData;
    }
  } catch (e) {
    console.log(e);
  }

  const pricingUpdated = !!pricingData ? dayjs(pricingData.updated).fromNow() : undefined;

  const getPriceChange = (change?: number | null | 'new') => {
    if (typeof change !== 'number') {
      return '';
    }

    if (change > 0) {
      return `\`+$${change.toFixed(2)}\` :chart_with_upwards_trend:`;
    }

    if (change < 0) {
      return `\`-$${(-change).toFixed(2)}\` :chart_with_downwards_trend:`;
    }

    return '';
  }

  const getVariantPricing = (foil: boolean) => {
    const variantPricing = pricingData.prices[foil ? 'foil' : 'nonFoil'];
    const change = pricingData?.change?.prices?.[foil ? 'foil' : 'nonFoil'];

    if (variantPricing) {
      const {
        highPrice,
        midPrice,
        lowPrice,
        marketPrice,
      } = variantPricing;

      const marketPriceChange = getPriceChange(change?.marketPrice);

      if (condensed) {
        return `${marketPrice ? `Market price: $${marketPrice.toFixed(2)}${marketPriceChange ? ` ${marketPriceChange}` : ''}` : '*No recent sales data.*'}`;
      }

      const lowPriceChange = getPriceChange(change?.lowPrice);
      const highPriceChange = getPriceChange(change?.highPrice);
      const midPriceChange = getPriceChange(change?.midPrice);

      const productURL = pricingData?.url ? `${pricingData.url}${encodeURIComponent(`${pricingData.url.includes(encodeURIComponent('?')) ? '&' : '?'}Printing=${foil ? 'Foil' : 'Normal'}`)}` : '';
      
      return `${marketPrice ? `Market price: [$${marketPrice.toFixed(2)}](${productURL})${marketPriceChange ? ` ${marketPriceChange}` : ''}` : '*No recent sales data.*'}
  ${lowPrice ? (
    `Low [$${lowPrice.toFixed(2)}](${productURL})${lowPriceChange ? ` ${lowPriceChange}` : ''}${midPrice ? `\nMid [$${midPrice.toFixed(2)}](${productURL})${midPriceChange ? ` ${midPriceChange}` : ''}` : ''}${highPrice ? `\nHigh [$${highPrice.toFixed(2)}](${productURL})${highPriceChange ? ` ${highPriceChange}` : ''}` : ''}`
  ) : `None available ([check](${productURL})`}`
    }
    
    return `This card has no ${foil ? 'foil' : 'non-foil'} market data available.`;
  }

  const output: {
    nonFoil?: string;
    foil?: string;
    updated: string;
    url: string;
  } = {
    updated: `Updated ${pricingUpdated} - updates daily.`,
    url: pricingData?.url,
  }

  if (pricingData?.prices.foil) {
    output.foil = getVariantPricing(true);
  }

  if (pricingData?.prices.nonFoil) {
    output.nonFoil = getVariantPricing(false);
  }

  return output;
}