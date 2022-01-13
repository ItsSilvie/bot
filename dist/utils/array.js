"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = void 0;
/**
 * This shuffles an array.
 * @param array The array to shuffle.
 */
const shuffleArray = (arr) => {
    // We don't want to mutate the array.
    const array = [...arr];
    // Below loop from: https://stackoverflow.com/a/12646864/1317805.
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
exports.shuffleArray = shuffleArray;
