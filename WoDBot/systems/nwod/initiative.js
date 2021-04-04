var Character = require('../../classes/character');
const fs = require('fs');
const server = require(`../../server.json`);
const { prefix } = require(`../../config.json`);
module.exports = {
    name: 'initiative',
    system: 'nwod',
    description: `Roll the everyone's initiative. To add NPCs, give their initiative mods as arguments.\nExample: "${prefix}initiative 7 6" will make two NPCs with initiatives of 7 and 6.`,
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        let party = game.party;
        characters = []
        for (let character of party) {
            characters.push(new Character(character.name, character.initiative))
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

