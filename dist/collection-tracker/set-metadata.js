"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetMetadata = exports.getSetInfo = exports.getSetLogo = void 0;
const getSetLogo = (setPrefix) => {
    switch (setPrefix) {
        case 'DOAp':
        case 'DOApSP':
            return 'DOA.png';
        default:
            return 'GA.png';
    }
};
exports.getSetLogo = getSetLogo;
const getSetInfo = (setPrefix) => {
    switch (setPrefix) {
        case 'CMT':
            return {
                year: 2021,
            };
        case 'DEMO22':
            return {
                year: 2022,
            };
        case 'DEMO22-SAMPLE':
            return {
                year: 2022,
            };
        case 'DOAp':
            return {
                year: 2023,
            };
        case 'DOAp-SAMPLE':
            return {
                year: 2022,
            };
        case 'P22':
            return {
                year: 2022,
            };
        case 'SAMPLE':
            return {
                year: 2021,
            };
        default:
            throw new Error(`No set info specified for ${setPrefix}`);
    }
};
exports.getSetInfo = getSetInfo;
const getSetMetadata = (setPrefix) => {
    switch (setPrefix) {
        case 'DEMO22':
            return {
                journal: 'All of the cards in this set are from boxes handed out by local game stores.',
                linked: {
                    description: 'Sample decks printed on thicker card stock also exists.',
                    name: 'LGS Demo 2022 (SAMPLE)',
                    prefix: 'DEMO22-SAMPLE',
                }
            };
        case 'DEMO22-SAMPLE':
            return {
                journal: 'Printed on thicker card stock, these were from packs handed out at Summer 2022 conventions.',
                linked: {
                    description: 'Legal to play decks printed on regular card stock also exist.',
                    name: 'LGS Demo 2022',
                    prefix: 'DEMO22',
                }
            };
        case 'DOAp':
            return {
                journal: 'More than half of the cards in this set come from the Lorraine and Rai Prelude Starter Decks!',
            };
        default:
            return;
    }
};
exports.getSetMetadata = getSetMetadata;
