import { PricingData } from "../types";
import { API_URL } from "./commands";
import * as dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTimePlugin);

export const getPricingData = async (editionUUID: string, foil: boolean) => {
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

  const variantPricing = pricingData?.prices[foil ? 'foil' : 'nonFoil'];
  const pricingUpdated = !!pricingData ? `*Updated ${dayjs(pricingData.updated).fromNow()}*` : undefined;

  if (variantPricing) {
    const {
      highPrice,
      lowPrice,
      marketPrice,
    } = variantPricing;

    const productURL = `${pricingData.url}${encodeURIComponent(`${pricingData.url.includes(encodeURIComponent('?')) ? '&' : '?'}Printing=${foil ? 'Foil' : 'Normal'}`)}`;
    
    return {
      data: pricingData,
      formattedReply: `${marketPrice ? `Recent average: [$${marketPrice.toFixed(2)}](${productURL})` : 'No recent sales'}
${lowPrice ? (
  `Available range: [$${lowPrice.toFixed(2)}](${productURL})${highPrice && highPrice ? ` to [$${highPrice.toFixed(2)}](${productURL})` : ''}`
) : 'None available ([check](${productURL})'}
${pricingUpdated}`,
    }
  }
  
  if (pricingData) {
    return {
      data: pricingData,
      formattedReply: `This card has no ${foil ? 'foil' : 'non-foil'} market data available.
${pricingUpdated}`
    };
  }
  
  return {
    data: pricingData,
    formattedReply: 'This card is not yet available on TCGplayer.'
  };
}