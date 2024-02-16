const getEVPCounts = (cards, setPrefix, evpCSRTotalPopulation) => {
    const getAllNonFoilCardsInSetByRarity = (rarity) => {
        const editions = cards.flatMap(entry => ([
            ...entry.editions.filter(edition => edition.set.prefix === setPrefix && edition.rarity === rarity)
        ]));
        return {
            count: editions.length,
            population: editions.reduce((n, edition) => n + (([...(edition.circulationTemplates ?? []), ...(edition.circulations ?? [])]).find(circulation => circulation.foil !== true)?.population ?? 0), 0),
        };
    };
    const getAllFoilCardsInSetByRarity = (rarity) => {
        const editions = cards.flatMap(entry => ([
            ...entry.editions.filter(edition => edition.set.prefix === setPrefix && edition.rarity === rarity)
        ]));
        return {
            count: editions.length,
            population: editions.reduce((n, edition) => n + (([...(edition.circulationTemplates ?? []), ...(edition.circulations ?? [])]).find(circulation => circulation.foil === true)?.population ?? 0), 0),
        };
    };
    const getTotalFoilsInSet = () => ([
        1,
        2,
        3,
        4,
        5, // UR
    ]).reduce((n, rarity) => n + getAllFoilCardsInSetByRarity(rarity).population, 0);
    const getTotalBoosterPackCount = () => (getAllNonFoilCardsInSetByRarity(2).population / 2);
    const totalFoilPopulation = getTotalFoilsInSet();
    const setBoosterPackCount = getTotalBoosterPackCount();
    const setBoosterBoxCount = setBoosterPackCount / 24;
    const foilsInSetBoosterPacks = setBoosterPackCount / 8;
    const foilsInEventPacks = totalFoilPopulation - foilsInSetBoosterPacks;
    const packsPerEVP = 64;
    const silverPacksPerEVP = 48;
    const silverPacksFoilRate = 0.25;
    const silverPacksWithFoilsPerEVP = silverPacksPerEVP * silverPacksFoilRate;
    const goldPacksPerEVP = packsPerEVP - silverPacksPerEVP;
    const goldPacksFoilRate = 0.5;
    const goldPacksWithFoilsPerEVP = goldPacksPerEVP * goldPacksFoilRate;
    const foilsPerEVP = silverPacksWithFoilsPerEVP + goldPacksWithFoilsPerEVP;
    const totalEVPsWithoutCSRs = foilsInEventPacks / foilsPerEVP;
    const csrsPerPackType = evpCSRTotalPopulation / 2;
    // If we say that e is the total number of Event Packs that exist without CSRs in I think there are 4 scenarios:
    // Scenario 1
    // e + CSRs + extra non-foil packs
    const scenario1TotalSilverPacks = (totalEVPsWithoutCSRs * silverPacksPerEVP) + (csrsPerPackType / silverPacksFoilRate);
    const scenario1TotalGoldPacks = (totalEVPsWithoutCSRs * goldPacksPerEVP) + (csrsPerPackType / goldPacksFoilRate);
    const scenario1EVPs = (scenario1TotalSilverPacks + scenario1TotalGoldPacks) / packsPerEVP;
    const scenario1SilverPacksCSRRate = (100 / scenario1TotalSilverPacks) * csrsPerPackType;
    const scenario1SilverPacksFoilRate = (100 - scenario1SilverPacksCSRRate) * silverPacksFoilRate;
    const scenario1SilverPacksNonFoilRate = (100 - scenario1SilverPacksCSRRate) * (1 - silverPacksFoilRate);
    const scenario1GoldPacksCSRRate = (100 / scenario1TotalGoldPacks) * csrsPerPackType;
    const scenario1GoldPacksFoilRate = (100 - scenario1GoldPacksCSRRate) * goldPacksFoilRate;
    const scenario1GoldPacksNonFoilRate = (100 - scenario1GoldPacksCSRRate) * (1 - goldPacksFoilRate);
    // Scenario 2
    // e + CSRs (no extra non-foil packs)
    const scenario2TotalSilverPacks = (totalEVPsWithoutCSRs * silverPacksPerEVP) + csrsPerPackType;
    const scenario2TotalGoldPacks = (totalEVPsWithoutCSRs * goldPacksPerEVP) + csrsPerPackType;
    const scenario2EVPs = (scenario2TotalSilverPacks + scenario2TotalGoldPacks) / packsPerEVP;
    const scenario2SilverPacksCSRRate = (100 / scenario2TotalSilverPacks) * csrsPerPackType;
    const scenario2SilverPacksFoilRate = (100 - scenario2SilverPacksCSRRate) * silverPacksFoilRate;
    const scenario2SilverPacksNonFoilRate = (100 - scenario2SilverPacksCSRRate) * (1 - silverPacksFoilRate);
    const scenario2GoldPacksCSRRate = (100 / scenario2TotalGoldPacks) * csrsPerPackType;
    const scenario2GoldPacksFoilRate = (100 - scenario2GoldPacksCSRRate) * goldPacksFoilRate;
    const scenario2GoldPacksNonFoilRate = (100 - scenario2GoldPacksCSRRate) * (1 - goldPacksFoilRate);
    // Scenario 3
    // e with CSRs replacing non-foil packs
    const scenario3TotalSilverPacks = (totalEVPsWithoutCSRs * silverPacksPerEVP);
    const scenario3TotalGoldPacks = (totalEVPsWithoutCSRs * goldPacksPerEVP);
    const scenario3EVPs = (scenario3TotalSilverPacks + scenario3TotalGoldPacks) / packsPerEVP;
    const scenario3SilverPacksCSRRate = (100 / scenario3TotalSilverPacks) * csrsPerPackType;
    const scenario3SilverPacksFoilRate = (100 - scenario3SilverPacksCSRRate) * silverPacksFoilRate;
    const scenario3SilverPacksNonFoilRate = (100 - scenario3SilverPacksCSRRate) * (1 - silverPacksFoilRate);
    const scenario3GoldPacksCSRRate = (100 / scenario3TotalGoldPacks) * csrsPerPackType;
    const scenario3GoldPacksFoilRate = (100 - scenario3GoldPacksCSRRate) * goldPacksFoilRate;
    const scenario3GoldPacksNonFoilRate = (100 - scenario3GoldPacksCSRRate) * (1 - goldPacksFoilRate);
    // Scenario 4
    // e with CSRs replacing foil packs
    const scenario4TotalSilverPacks = scenario3TotalSilverPacks;
    const scenario4TotalGoldPacks = scenario3TotalGoldPacks;
    const scenario4EVPs = scenario3EVPs;
    const scenario4SilverPacksCSRRate = (100 / scenario4TotalSilverPacks) * csrsPerPackType;
    const scenario4SilverPacksFoilRate = (100 - scenario4SilverPacksCSRRate) * silverPacksFoilRate;
    const scenario4SilverPacksNonFoilRate = (100 - scenario4SilverPacksCSRRate) * (1 - silverPacksFoilRate);
    const scenario4GoldPacksCSRRate = (100 / scenario4TotalGoldPacks) * csrsPerPackType;
    const scenario4GoldPacksFoilRate = (100 - scenario4GoldPacksCSRRate) * goldPacksFoilRate;
    const scenario4GoldPacksNonFoilRate = (100 - scenario4GoldPacksCSRRate) * (1 - goldPacksFoilRate);
    const lowestSilverPackCount = Math.min(scenario1TotalSilverPacks, scenario2TotalSilverPacks, scenario3TotalSilverPacks, scenario4TotalSilverPacks);
    const lowestGoldPackCount = Math.min(scenario1TotalGoldPacks, scenario2TotalGoldPacks, scenario3TotalGoldPacks, scenario4TotalGoldPacks);
    const output = {
        lowestSilverPackCount,
        lowestGoldPackCount,
        totalFoilPopulation,
        set: {
            setBoosterPackCount,
            setBoosterBoxCount,
            foilsInSetBoosterPacks,
        },
        evp: {
            foilsInEventPacks,
            silverPacksPerEVP,
            silverPacksFoilRate,
            silverPacksWithFoilsPerEVP,
            goldPacksPerEVP,
            goldPacksFoilRate,
            goldPacksWithFoilsPerEVP,
            foilsPerEVP,
        },
        scenario1: {
            scenario1TotalSilverPacks,
            scenario1TotalGoldPacks,
            scenario1EVPs,
            scenario1SilverPacksFoilRate,
            scenario1SilverPacksNonFoilRate,
            scenario1SilverPacksCSRRate,
            scenario1GoldPacksFoilRate,
            scenario1GoldPacksNonFoilRate,
            scenario1GoldPacksCSRRate,
        },
        scenario2: {
            scenario2TotalSilverPacks,
            scenario2TotalGoldPacks,
            scenario2EVPs,
            scenario2SilverPacksFoilRate,
            scenario2SilverPacksNonFoilRate,
            scenario2SilverPacksCSRRate,
            scenario2GoldPacksFoilRate,
            scenario2GoldPacksNonFoilRate,
            scenario2GoldPacksCSRRate,
        },
        scenario3: {
            scenario3TotalSilverPacks,
            scenario3TotalGoldPacks,
            scenario3EVPs,
            scenario3SilverPacksFoilRate,
            scenario3SilverPacksNonFoilRate,
            scenario3SilverPacksCSRRate,
            scenario3GoldPacksFoilRate,
            scenario3GoldPacksNonFoilRate,
            scenario3GoldPacksCSRRate,
        },
        scenario4: {
            scenario4TotalSilverPacks,
            scenario4TotalGoldPacks,
            scenario4EVPs,
            scenario4SilverPacksFoilRate,
            scenario4SilverPacksNonFoilRate,
            scenario4SilverPacksCSRRate,
            scenario4GoldPacksFoilRate,
            scenario4GoldPacksNonFoilRate,
            scenario4GoldPacksCSRRate,
        },
    };
    console.log(output);
};
