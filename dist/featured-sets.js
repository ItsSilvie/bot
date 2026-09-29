"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFeaturedSetLogos = void 0;
const fs = require("fs");
const path = require("path");
const node_fetch_1 = require("node-fetch");
const https = require("https");
const constants_1 = require("./utils/constants");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const featuredSetsPath = './src/api-data/featured-sets.json';
const logoPath = '../img.silvie.org/docs/cdn/collection-tracker/logo';
const downloadFeaturedSetLogos = async () => {
    const featuredSets = await (0, node_fetch_1.default)(`${constants_1.API_BASE}/featured-sets`, { agent: httpsAgent })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Unable to fetch featured sets (${response.status})`);
        }
        return response.json();
    });
    fs.mkdirSync(path.resolve(logoPath), { recursive: true });
    fs.writeFileSync(featuredSetsPath, JSON.stringify(featuredSets), 'utf8');
    for (const featuredSet of featuredSets) {
        const filename = path.basename(featuredSet.image);
        if (!filename || filename === '.') {
            console.warn(`Skipping featured set with invalid image path: ${featuredSet.image}`);
            continue;
        }
        const response = await (0, node_fetch_1.default)(`${constants_1.API_BASE}/featured-sets/images/${encodeURIComponent(filename)}`, {
            agent: httpsAgent,
        });
        if (!response.ok || !response.body) {
            throw new Error(`Unable to fetch featured set logo ${filename} (${response.status})`);
        }
        const buffer = await response.buffer();
        fs.writeFileSync(path.resolve(logoPath, filename), buffer);
        console.log(`Downloaded featured set logo ${filename}`);
    }
    return featuredSets;
};
exports.downloadFeaturedSetLogos = downloadFeaturedSetLogos;
