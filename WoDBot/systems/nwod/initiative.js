var Character = require('../../classes/character');
module.exports = {
    name: 'initiative',
    system: 'nwod',
    description: 'roll initiatives',
    execute(message, args) {
        characters = []
        for (let character of party) {
            characters.push(new Character(character.name, character.initMod))
        }
        if (args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                characters.push(new Character(`NPC ${i + 1}`, args[i]))
            }
        }
        for (let character of characters) {
            character.rollInitiative()
        }
        characters.sort(function (a, b) { return b.initiative == a.initiative ? b.initMod - a.initMod : b.initiative - a.initiative });
        messageString = "```";
        for (let character of characters) {
            messageString += character.name + ": " + character.initiativeRoll + "\n"
        }
        messageString += "```"
        message.channel.send(messageString);
    },
};

