"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetMetadata = exports.getSetInfo = exports.getSetCategory = exports.getSetLogo = void 0;
const getSetLogo = (setPrefix) => {
    switch (setPrefix) {
        case 'ALC':
        case 'ALC 1st':
        case 'ALCSD':
            return 'ALC.png';
        case 'MRC':
        case 'MRC 1st':
        case 'ReC-SHD':
        case 'ReC-SLM':
            return 'MRC.png';
        case 'DOA 1st':
        case 'DOA Alter':
        case 'DOASD':
        case 'DOAp':
        case 'DOApSP':
            return 'DOA.png';
        case 'FTC':
        case 'FTCA':
            return 'FTC.png';
        case 'SLC':
            return 'SLC.png';
        default:
            return 'GA.png';
    }
};
exports.getSetLogo = getSetLogo;
const getSetCategory = (setPrefix) => {
    switch (setPrefix) {
        case 'ALC':
        case 'ALC 1st':
        case 'ALCSD':
        case 'MRC':
        case 'MRC 1st':
        case 'ReC-SHD':
        case 'ReC-SLM':
            return 'Alchemical Revolution';
        case 'AMB':
        case 'AMB 1st':
        case 'AMBSD':
            return 'Mortal Ambition';
        case 'DOA 1st':
        case 'DOA Alter':
        case 'DOASD':
        case 'DOAp':
        case 'DOApSP':
        case 'FTC':
        case 'FTCA':
            return 'Dawn of Ashes';
        case 'GSC':
        case 'EVP':
        case 'KSP':
        case 'P22':
        case 'P23':
        case 'P24':
        case 'SLC':
            return 'Promotional';
        case 'DEMO22':
        case 'DEMO23':
            return 'Demo decks';
        case 'SAMPLE':
        case 'DEMO22-SAMPLE':
            return 'Samples';
        default:
            return 'Miscellaneous';
    }
};
exports.getSetCategory = getSetCategory;
var SetType;
(function (SetType) {
    SetType["Deck"] = "deck";
    SetType["Promo"] = "promo";
    SetType["Sample"] = "sample";
    SetType["Special"] = "special";
    SetType["Standard"] = "standard";
})(SetType || (SetType = {}));
const getSetInfo = (setPrefix) => {
    switch (setPrefix) {
        case 'ALC':
        case 'ALC 1st':
        case 'AMB':
        case 'AMB 1st':
        case 'MRC':
        case 'MRC 1st':
            return {
                type: [SetType.Standard],
                year: 2024,
            };
        case 'ALCSD':
        case 'AMBSD':
        case 'ReC-SHD':
        case 'ReC-SLM':
            return {
                type: [SetType.Deck],
                year: 2024,
            };
        case 'DEMO22':
            return {
                type: [SetType.Deck],
                year: 2022,
            };
        case 'DEMO22-SAMPLE':
            return {
                type: [SetType.Deck, SetType.Sample],
                year: 2022,
            };
        case 'DEMO23':
            return {
                type: [SetType.Deck],
                year: 2023,
            };
        case 'DOA 1st':
        case 'DOA Alter':
            return {
                type: [SetType.Standard],
                year: 2023,
            };
        case 'DOAp':
        case 'DOASD':
            return {
                type: [SetType.Standard],
                year: 2023,
            };
        case 'FTC':
        case 'FTCA':
            return {
                type: [SetType.Standard],
                year: 2023,
            };
        case 'GSC':
        case 'KS-Metal':
        case 'KSP':
            return {
                type: [SetType.Promo],
                year: 2023,
            };
        case 'SAMPLE':
            return {
                type: [SetType.Sample],
                year: 2021,
            };
        case 'EVP':
        case 'PRXY':
        case 'SP1':
            return {
                type: [SetType.Special],
                year: 2023,
            };
        case 'P22':
            return {
                type: [SetType.Promo],
                year: 2022,
            };
        case 'P23':
            return {
                type: [SetType.Promo],
                year: 2023,
            };
        case 'P24':
        case 'SLC':
            return {
                type: [SetType.Promo],
                year: 2024,
            };
        case 'SP2':
            return {
                type: [SetType.Special],
                year: 2024,
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
        case 'SAMPLE':
            return {
                journal: 'These sample cards were given out between November 2021 and June 2022. They are not legal for play.'
            };
        default:
            return;
    }
};
exports.getSetMetadata = getSetMetadata;
