const { DiceRoll } = require('rpg-dice-roller/lib/umd/bundle.js');
class Character {
    constructor(name, initMod) {
        this.name = name;
        this.initMod = initMod;
    }

    rollInitiative() {
        let roll = new DiceRoll(`1d10 + ${this.initMod}`)
        this.initiative = parseInt(roll.output.slice(roll.output.lastIndexOf(' ')));
        this.initiativeRoll = roll.output.slice(roll.output.indexOf('['))
    }
}

module.exports = Character;