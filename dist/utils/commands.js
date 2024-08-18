"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetAutocomplete = exports.API_URL = exports.unauthenticatedMessage = void 0;
const sets = require("../api-data/sets.json");
exports.unauthenticatedMessage = 'This command requires your Discord account to be linked to your Silvie.org account. You can link your Discord account at https://portal.silvie.org.';
exports.API_URL = 'https://api.silvie.org';
const handleSetAutocomplete = async (interaction, setListOverride) => {
    const focusedOption = interaction.options.getFocused(true);
    const choices = [...Object.values(setListOverride ?? sets)].sort(({ name: aName }, { name: bName }) => {
        return aName < bName ? -1 : 1;
    });
    const filtered = choices.filter((choice, index) => {
        if (!focusedOption.value) {
            return index < 10;
        }
        return choice.name.toLowerCase().includes(`${focusedOption.value}`.toLowerCase()) || choice.prefix.toLowerCase().includes(`${focusedOption.value}`.toLowerCase());
    });
    return await interaction.respond(filtered.map(choice => ({ name: choice.name, value: choice.prefix })));
};
exports.handleSetAutocomplete = handleSetAutocomplete;
