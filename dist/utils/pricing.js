"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricingData = void 0;
const commands_1 = require("./commands");
const dayjs = require("dayjs");
const relativeTimePlugin = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTimePlugin);
const getPricingData = async (editionUUID, foil) => {
    let pricingData = undefined;
    try {
        const queryParams = new URLSearchParams({
            id: editionUUID,
        });
        const apiPricingData = await fetch(`${commands_1.API_URL}/api/pricing?${queryParams.toString()}`)
            .then(res => res.json());
        if (apiPricingData && !apiPricingData.error && Object.keys(apiPricingData).length > 0) {
            pricingData = apiPricingData;
        }
    }
    catch (e) {
        console.log(e);
    }
    if (!pricingData) {
        return {
            data: pricingData,
            formattedReply: 'This card is not yet available on TCGplayer.'
        };
    }
    const pricingUpdated = !!pricingData ? dayjs(pricingData.updated).fromNow() : undefined;
    const getVariantPricing = (foil) => {
        const variantPricing = pricingData.prices[foil ? 'foil' : 'nonFoil'];
        if (variantPricing) {
            const { highPrice, midPrice, lowPrice, marketPrice, } = variantPricing;
            const productURL = `${pricingData.url}${encodeURIComponent(`${pricingData.url.includes(encodeURIComponent('?')) ? '&' : '?'}Printing=${foil ? 'Foil' : 'Normal'}`)}`;
            return `${marketPrice ? `Market price: [$${marketPrice.toFixed(2)}](${productURL})` : 'No recent sales'}
  ${lowPrice ? (`Low [$${lowPrice.toFixed(2)}](${productURL})${midPrice ? ` · Mid [$${midPrice.toFixed(2)}](${productURL})` : ''}${highPrice ? ` · High [$${highPrice.toFixed(2)}](${productURL})` : ''}`) : 'None available ([check](${productURL})'}`;
        }
        return `This card has no ${foil ? 'foil' : 'non-foil'} market data available.`;
    };
    if (typeof foil === 'boolean') {
        return {
            data: pricingData,
            formattedReply: `${getVariantPricing(foil)}
*Updated ${pricingUpdated}*`
        };
    }
    const output = {
        updated: `Updated ${pricingUpdated} - updates daily.`,
        url: pricingData.url,
    };
    if (pricingData.prices.foil) {
        output.foil = getVariantPricing(true);
    }
    if (pricingData.prices.nonFoil) {
        output.nonFoil = getVariantPricing(false);
    }
    return output;
};
exports.getPricingData = getPricingData;
