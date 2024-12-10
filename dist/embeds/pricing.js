"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const pricing_1 = require("../utils/pricing");
const options = require("../api-data/options.json");
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const dayjs = require("dayjs");
const advancedFormat = require("dayjs/plugin/advancedFormat");
const rarity_1 = require("../utils/rarity");
dayjs.extend(advancedFormat);
const chartPlugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#99ffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};
const generateCanva = async (title, subtitle, labels, datasetNonFoilMarketPrice, datasetNonFoilLowPrice, datasetNonFoilMidPrice, datasetFoilMarketPrice, datasetFoilLowPrice, datasetFoilMidPrice, isSealedProduct) => {
    const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
    const sharedDatasetOptions = {
        cubicInterpolationMode: 'monotone',
        pointRadius: 0,
        pointStyle: 'false',
        segment: {
            backgroundColor: ctx => skipped(ctx, 'transparent'),
            borderColor: ctx => skipped(ctx, 'rgba(255, 255, 255, 0.2)'),
            borderWidth: ctx => skipped(ctx, 1),
            borderDash: ctx => skipped(ctx, [6, 6]),
        },
        spanGaps: true,
    };
    const gridColors = {
        color: 'rgba(255, 255, 255, 0.25)',
        tickColor: 'rgba(255, 255, 255, 0.25)',
    };
    const sharedYAxisTicks = {
        callback: value => `$${value.toFixed(2)}`,
        padding: 6,
    };
    const sharedYAxesOptions = {
        gridLines: {
            display: true,
            drawBorder: true,
            drawOnChartArea: false
        },
    };
    const renderer = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width: 540, height: 540 });
    const chartScales = {
        x: {
            grid: gridColors,
            ticks: {
                color: '#fff',
            }
        },
    };
    let datasets = [];
    const hasNonFoilDatasets = [
        ...datasetNonFoilMarketPrice,
        ...datasetNonFoilMidPrice,
        ...datasetNonFoilLowPrice,
    ].some(entry => !!entry && !Number.isNaN(entry));
    const hasFoilDatasets = [
        ...datasetFoilMarketPrice,
        ...datasetFoilMidPrice,
        ...datasetFoilLowPrice,
    ].some(entry => !!entry && !Number.isNaN(entry));
    if (hasFoilDatasets) {
        // @ts-ignore
        chartScales.y2 = {
            ...sharedYAxesOptions,
            display: hasFoilDatasets,
            grace: '10%',
            grid: gridColors,
            title: {
                color: 'rgba(255, 246, 155, 1)',
                display: true,
                font: {
                    size: 17,
                },
                text: 'Foil',
            },
            ticks: {
                ...sharedYAxisTicks,
                color: 'rgba(255, 246, 155, 1)',
            },
            type: 'linear',
            offset: true,
            position: 'right',
            stack: 'demo',
            stackWeight: 1,
        };
        datasets = [
            ...datasets,
            {
                ...sharedDatasetOptions,
                label: 'Market[foil]',
                data: datasetFoilMarketPrice,
                backgroundColor: 'rgba(255, 246, 155, 0.05)',
                borderColor: 'rgba(255, 246, 155, 1)',
                yAxisID: 'y2',
                fill: 'start',
            },
            {
                ...sharedDatasetOptions,
                label: 'Mid[foil]',
                data: datasetFoilMidPrice,
                borderColor: 'rgba(255, 246, 155, 1)',
                borderDash: [5],
                yAxisID: 'y2',
            },
            {
                ...sharedDatasetOptions,
                label: 'Low[foil]',
                data: datasetFoilLowPrice,
                borderColor: 'rgba(255, 246, 155, 1)',
                borderDash: [2],
                yAxisID: 'y2',
            },
        ];
    }
    if (hasNonFoilDatasets) {
        // @ts-ignore
        chartScales.y = {
            ...sharedYAxesOptions,
            display: hasNonFoilDatasets,
            grace: '10%',
            grid: gridColors,
            title: {
                color: isSealedProduct ? 'rgba(96, 189, 124, 1)' : 'rgba(255, 147, 130, 1)',
                display: true,
                font: {
                    size: 17,
                },
                text: isSealedProduct ? 'Sealed' : 'Non-foil',
            },
            ticks: {
                ...sharedYAxisTicks,
                color: isSealedProduct ? 'rgba(96, 189, 124, 1)' : 'rgba(255, 147, 130, 1)',
            },
            type: 'linear',
            offset: true,
            position: 'right',
            stack: 'demo',
            stackWeight: 2,
        };
        datasets = [
            ...datasets,
            {
                ...sharedDatasetOptions,
                label: 'Market',
                data: datasetNonFoilMarketPrice,
                backgroundColor: isSealedProduct ? 'rgba(96, 189, 124, 0.05)' : 'rgba(255, 147, 130, 0.05)',
                borderColor: isSealedProduct ? 'rgba(96, 189, 124, 1)' : 'rgba(255, 147, 130, 1)',
                yAxisID: 'y',
                fill: 'start',
            },
            {
                ...sharedDatasetOptions,
                label: 'Mid',
                data: datasetNonFoilMidPrice,
                borderColor: isSealedProduct ? 'rgba(96, 189, 124, 1)' : 'rgba(255, 147, 130, 1)',
                borderDash: [5],
                yAxisID: 'y',
            },
            {
                ...sharedDatasetOptions,
                label: 'Low',
                data: datasetNonFoilLowPrice,
                borderColor: isSealedProduct ? 'rgba(96, 189, 124, 1)' : 'rgba(255, 147, 130, 1)',
                borderDash: [2],
                yAxisID: 'y',
            },
        ];
    }
    const image = await renderer.renderToBuffer({
        type: 'line',
        data: {
            labels,
            datasets,
        },
        options: {
            responsive: true,
            plugins: {
                // @ts-ignore
                customCanvasBackgroundColor: {
                    color: '#333',
                },
                legend: {
                    labels: {
                        boxHeight: 0,
                        color: '#fff',
                        generateLabels: (chart) => (chart.data.datasets
                            .filter(dataset => !hasNonFoilDatasets || !dataset.label.toLowerCase().includes('[foil]'))
                            .map((dataset, index) => ({
                            datasetIndex: index,
                            fillStyle: '#fff',
                            lineDash: (() => {
                                switch (dataset.label.replace('[foil]', '')) {
                                    case 'Mid':
                                        return [5];
                                    case 'Low':
                                        return [2];
                                    default:
                                        return;
                                }
                            })(),
                            strokeStyle: (() => {
                                switch (dataset.label.replace('[foil]', '')) {
                                    case 'Mid':
                                        return 'rgba(255, 255, 255, 1)';
                                    case 'Low':
                                        return 'rgba(255, 255, 255, 1)';
                                    default:
                                        return '#fff';
                                }
                            })(),
                            text: dataset.label.replace('[foil]', ''),
                        }))),
                    },
                    position: 'bottom',
                },
                subtitle: {
                    color: '#eee',
                    display: true,
                    font: {
                        size: 18,
                    },
                    padding: {
                        bottom: 20,
                        top: 0,
                    },
                    text: subtitle,
                },
                title: {
                    color: '#fff',
                    display: true,
                    font: {
                        size: 24,
                    },
                    padding: {
                        bottom: 0,
                        top: 20,
                    },
                    text: title,
                },
            },
            scales: chartScales,
        },
        plugins: [chartPlugin],
    });
    return new discord_js_1.MessageAttachment(image, "graph.png");
};
const pricingEmbed = async (card, edition) => {
    const isSealedProduct = edition === 'SEALED';
    const collector_number = !isSealedProduct ? edition.collector_number : '000';
    const set = !isSealedProduct ? edition.set : undefined;
    let id;
    if ("productId" in card) {
        id = card.productId;
    }
    else if (!isSealedProduct) {
        id = edition.uuid;
    }
    else {
        throw new Error('Mismatched parameters.');
    }
    const pricingData = await (0, pricing_1.getPricingData)(id, undefined, isSealedProduct);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(card.name)
        .setURL(pricingData?.url)
        .setAuthor({ name: 'TCGplayer Market Data', url: `https://partner.tcgplayer.com/silviebot?u=${encodeURIComponent('https://www.tcgplayer.com/search/grand-archive/product?productLineName=grand-archive&view=grid')}` });
    if (edition !== 'SEALED') {
        embed.setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`);
    }
    if ("element" in card) {
        embed.setColor((0, card_1.getEmbedColorFromElement)(types_1.IndexCardElement[card.element]));
    }
    if (pricingData?.nonFoil) {
        embed.addField(isSealedProduct ? 'Sealed' : 'Non-foil', pricingData.nonFoil);
    }
    if (pricingData?.foil) {
        embed.addField(`Foil`, pricingData.foil);
    }
    if (pricingData?.similar) {
        if (pricingData.similar.quantity === 1) {
            // This is the only edition of this card.
            embed.addField('Insights', `This is [the only version](${pricingData.similar.url}) on TCGplayer.`);
        }
        else {
            embed.addField('Insights', `TCGplayer lists [${pricingData.similar.quantity} versions](${pricingData.similar.url}) of this ${isSealedProduct ? 'sealed product' : 'card'}.
${pricingData.lowestPrice ? (`Cheapest: [$${pricingData.lowestPrice.price.toFixed(2)}](${pricingData.lowestPrice.url})`) : (`This one has the lowest price`)}.`);
        }
    }
    if (!pricingData?.nonFoil && !pricingData?.foil) {
        embed.addField('Pricing data unavailable', 'This card does not appear to be available on TCGplayer.');
    }
    else {
        embed.setImage(`https://img.silvie.org/web/powered-by-tcgplayer.png`);
        embed.setFooter({
            text: `${pricingData?.updated}\nAffiliate links help keep Silvie.org online.`,
        });
    }
    if (pricingData?.history) {
        const reversedHistory = [...pricingData.history].reverse();
        const currentYear = (new Date()).getFullYear();
        const labels = reversedHistory.map(entry => {
            const labelYear = new Date(entry.updated).getFullYear();
            if (labelYear !== currentYear) {
                return dayjs(entry.updated).format('Do MMM YY');
            }
            return dayjs(entry.updated).format('Do MMM');
        });
        const canva = await generateCanva(card.name, 
        // @ts-ignore
        `${!isSealedProduct ? `${edition.set.prefix} ${edition.set.language}-${edition.collector_number} ${(0, rarity_1.getRarityCodeFromRarityId)(edition.rarity)}` : 'Sealed product'} — Price history`, labels, reversedHistory.map(entry => {
            if (entry.prices.nonFoil?.marketPrice) {
                return entry.prices.nonFoil?.marketPrice;
            }
            return NaN;
        }), reversedHistory.map(entry => {
            if (entry.prices.nonFoil?.lowPrice) {
                return entry.prices.nonFoil?.lowPrice;
            }
            return NaN;
        }), reversedHistory.map(entry => {
            if (entry.prices.nonFoil?.midPrice) {
                return entry.prices.nonFoil?.midPrice;
            }
            return NaN;
        }), reversedHistory.map(entry => {
            if (entry.prices.foil?.marketPrice) {
                return entry.prices.foil?.marketPrice;
            }
            return NaN;
        }), reversedHistory.map(entry => {
            if (entry.prices.foil?.lowPrice) {
                return entry.prices.foil?.lowPrice;
            }
            return NaN;
        }), reversedHistory.map(entry => {
            if (entry.prices.foil?.midPrice) {
                return entry.prices.foil?.midPrice;
            }
            return NaN;
        }), isSealedProduct);
        embed.setImage('attachment://graph.png');
        return {
            embed,
            attachment: canva,
        };
    }
    return {
        embed,
    };
};
exports.default = pricingEmbed;
