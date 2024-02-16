"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricingData = void 0;
const commands_1 = require("./commands");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);
dayjs.extend(relativeTime, {
    thresholds: [
        { l: 's', r: 1 },
        { l: 'ss', r: 59, d: 'second' },
        { l: 'm', r: 1 },
        { l: 'mm', r: 59, d: 'minute' },
        { l: 'h', r: 1 },
        { l: 'hh', r: 48, d: 'hour' },
        { l: 'd', r: 9999, d: 'day' },
    ]
});
dayjs.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'a few seconds',
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "%d days",
    }
});
const getPricingData = async (editionUUID, condensed) => {
    let pricingData = undefined;
    try {
        const queryParams = new URLSearchParams({
            id: editionUUID,
            history: 'daily',
        });
        if (!condensed) {
            queryParams.append('lowest', 'true');
        }
        const apiPricingData = await fetch(`${commands_1.API_URL}/api/pricing?${queryParams.toString()}`)
            .then(res => res.json());
        if (apiPricingData && !apiPricingData.error && Object.keys(apiPricingData).length > 0) {
            pricingData = apiPricingData;
        }
    }
    catch (e) {
        console.log(e);
    }
    const pricingUpdated = !!pricingData ? dayjs(pricingData.updated).fromNow() : undefined;
    const getPriceChange = (change) => {
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
    };
    const getVariantPricing = (foil) => {
        const variantPricing = pricingData.prices[foil ? 'foil' : 'nonFoil'];
        const change = pricingData?.change?.prices?.[foil ? 'foil' : 'nonFoil'];
        if (variantPricing) {
            const { midPrice, lowPrice, marketPrice, } = variantPricing;
            const marketPriceChange = getPriceChange(change?.marketPrice);
            if (condensed) {
                return `${marketPrice ? `Market price: $${marketPrice.toFixed(2)}${marketPriceChange ? ` ${marketPriceChange}` : ''}` : '*No recent sales data.*'}`;
            }
            const lowPriceChange = getPriceChange(change?.lowPrice);
            const midPriceChange = getPriceChange(change?.midPrice);
            const lowMidHighDelimiter = lowPriceChange || midPriceChange ? '\n' : ' · ';
            const productURL = pricingData?.url ? `${pricingData.url}${encodeURIComponent(`${pricingData.url.includes(encodeURIComponent('?')) ? '&' : '?'}Printing=${foil ? 'Foil' : 'Normal'}`)}` : '';
            return `${marketPrice ? `Market price: [$${marketPrice.toFixed(2)}](${productURL})${marketPriceChange ? ` ${marketPriceChange}` : ''}` : '*No recent sales data.*'}${lowPrice ? (`\nLow: [$${lowPrice.toFixed(2)}](${productURL})${lowPriceChange ? ` ${lowPriceChange}` : ''}${midPrice ? `${lowMidHighDelimiter}Mid: [$${midPrice.toFixed(2)}](${productURL})${midPriceChange ? ` ${midPriceChange}` : ''}` : ''}`) : `\nNone available ([check](${productURL})`}`;
        }
        return `This card has no ${foil ? 'foil' : 'non-foil'} market data available.`;
    };
    const output = {
        similar: pricingData?.similar,
        updated: `Updated ${pricingUpdated} - updates daily.`,
        url: pricingData?.url,
    };
    if (pricingData?.prices.foil) {
        output.foil = getVariantPricing(true);
    }
    if (pricingData?.prices.nonFoil) {
        output.nonFoil = getVariantPricing(false);
    }
    if (pricingData?.lowestPrice) {
        output.lowestPrice = pricingData.lowestPrice;
    }
    return output;
};
exports.getPricingData = getPricingData;
