import { PricingData } from "../types";
import { API_URL } from "./commands";
import * as dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTimePlugin);

export const getPricingData = async (editionUUID: string, foil: boolean | undefined) => {
  let pricingData: PricingData | undefined = undefined;

  try {				
    const queryParams = new URLSearchParams({
      id: editionUUID,
    });

    const apiPricingData = await fetch(`${API_URL}/api/pricing?${queryParams.toString()}`)
      .then(res => res.json())

    if (apiPricingData && !apiPricingData.error && Object.keys(apiPricingData).length > 0) {
      pricingData = apiPricingData;
    }
  } catch (e) {
    console.log(e);
  }

  if (!pricingData) {
    return {
      data: pricingData,
      formattedReply: 'This card is not yet available on TCGplayer.'
    };
  }

  const pricingUpdated = !!pricingData ? dayjs(pricingData.updated).fromNow() : undefined;

  const getVariantPricing = (foil: boolean) => {
    const variantPricing = pricingData.prices[foil ? 'foil' : 'nonFoil'];

    if (variantPricing) {
      const {
        highPrice,
        midPrice,
        lowPrice,
        marketPrice,
      } = variantPricing;

      const productURL = `${pricingData.url}${encodeURIComponent(`${pricingData.url.includes(encodeURIComponent('?')) ? '&' : '?'}Printing=${foil ? 'Foil' : 'Normal'}`)}`;
      
      return `${marketPrice ? `Market price: [$${marketPrice.toFixed(2)}](${productURL})` : 'No recent sales'}
  ${lowPrice ? (
    `Low [$${lowPrice.toFixed(2)}](${productURL})${midPrice ? ` · Mid [$${midPrice.toFixed(2)}](${productURL})` : ''}${highPrice ? ` · High [$${highPrice.toFixed(2)}](${productURL})` : ''}`
  ) : 'None available ([check](${productURL})'}`;
    }
    
    return `This card has no ${foil ? 'foil' : 'non-foil'} market data available.`;
  }

  if (typeof foil === 'boolean') {
    return {
      data: pricingData,
      formattedReply: `${getVariantPricing(foil)}
*Updated ${pricingUpdated}*`
    };
  }

  const output: {
    nonFoil?: string;
    foil?: string;
    updated: string;
    url: string;
  } = {
    updated: `Updated ${pricingUpdated} - updates daily.`,
    url: pricingData.url,
  }

  if (pricingData.prices.foil) {
    output.foil = getVariantPricing(true);
  }

  if (pricingData.prices.nonFoil) {
    output.nonFoil = getVariantPricing(false);
  }

  return output;
}