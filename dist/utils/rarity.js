"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rarity = exports.getRarityCodeFromRarityId = void 0;
const getRarityCodeFromRarityId = (rarityId) => {
    if (rarityId < 1 || rarityId > 9) {
        throw new Error(`Unhandled rarity ID: ${rarityId}`);
    }
    const rarityArr = [
        'C',
        'U',
        'R',
        'SR',
        'UR',
        'PR',
        'CSR',
        'CUR',
        'CPR', // 9
    ];
    return rarityArr[rarityId - 1];
};
exports.getRarityCodeFromRarityId = getRarityCodeFromRarityId;
var Rarity;
(function (Rarity) {
    Rarity["C"] = "Common";
    Rarity["U"] = "Uncommon";
    Rarity["R"] = "Rare";
    Rarity["SR"] = "Super Rare";
    Rarity["UR"] = "Ultra Rare";
    Rarity["PR"] = "Promotional Rare";
    Rarity["CSR"] = "Collector Super Rare";
    Rarity["CUR"] = "Collector Ultra Rare";
    Rarity["CPR"] = "Collector Promo Rare";
})(Rarity = exports.Rarity || (exports.Rarity = {}));
