"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardVariant = exports.CardType = exports.CardSupertype = exports.CardSubtype = exports.CardSpeed = exports.CardEffect = exports.CardElement = exports.CardCost = void 0;
var CardCost;
(function (CardCost) {
    CardCost["Memory"] = "Memory";
    CardCost["Reserve"] = "Reserve";
})(CardCost = exports.CardCost || (exports.CardCost = {}));
var CardElement;
(function (CardElement) {
    CardElement["Arcane"] = "Arcane";
    CardElement["Crux"] = "Crux";
    CardElement["Fire"] = "Fire";
    CardElement["Normal"] = "Normal";
    CardElement["Water"] = "Water";
    CardElement["Wind"] = "Wind";
})(CardElement = exports.CardElement || (exports.CardElement = {}));
var CardEffect;
(function (CardEffect) {
    CardEffect["Banish"] = "Banish";
    CardEffect["Efficiency"] = "Efficiency";
    CardEffect["Enter"] = "Enter Effect";
    CardEffect["FastAttack"] = "Fast Attack";
    CardEffect["FloatingMemory"] = "Floating Memory";
    CardEffect["Flux"] = "Flux";
    CardEffect["Glimpse"] = "Glimpse LV";
    CardEffect["Inherited"] = "Inherited Effect";
    CardEffect["Intercept"] = "Intercept";
    CardEffect["Lineage"] = "Lineage";
    CardEffect["MultiTarget"] = "Multi-Target";
    CardEffect["Stealth"] = "Stealth";
    CardEffect["SpectralShift"] = "Spectral Shift";
    CardEffect["TrueSight"] = "True Sight";
})(CardEffect = exports.CardEffect || (exports.CardEffect = {}));
var CardSpeed;
(function (CardSpeed) {
    CardSpeed["Fast"] = "Fast";
    CardSpeed["Slow"] = "Slow";
})(CardSpeed = exports.CardSpeed || (exports.CardSpeed = {}));
var CardSubtype;
(function (CardSubtype) {
    CardSubtype["Artifact"] = "Artifact";
    CardSubtype["Bauble"] = "Bauble";
    CardSubtype["Book"] = "Book";
    CardSubtype["Cleric"] = "Cleric";
    CardSubtype["Sceptre"] = "Sceptre";
    CardSubtype["Sword"] = "Sword";
})(CardSubtype = exports.CardSubtype || (exports.CardSubtype = {}));
var CardSupertype;
(function (CardSupertype) {
    CardSupertype["Assassin"] = "Assassin";
    CardSupertype["Mage"] = "Mage";
    CardSupertype["Spirit"] = "Spirit";
    CardSupertype["Tamer"] = "Tamer";
    CardSupertype["Warrior"] = "Warrior";
})(CardSupertype = exports.CardSupertype || (exports.CardSupertype = {}));
var CardType;
(function (CardType) {
    CardType["Action"] = "Action";
    CardType["Ally"] = "Ally";
    CardType["Attack"] = "Attack";
    CardType["Champion"] = "Champion";
    CardType["RegaliaItem"] = "Regalia Item";
    CardType["RegaliaWeapon"] = "Regalia Weapon";
})(CardType = exports.CardType || (exports.CardType = {}));
var CardVariant;
(function (CardVariant) {
    CardVariant["Foil"] = "Foil";
    CardVariant["StarFoil"] = "Star Foil";
})(CardVariant = exports.CardVariant || (exports.CardVariant = {}));
