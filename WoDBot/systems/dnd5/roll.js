const { DiceRoll } = require('rpg-dice-roller/lib/umd/bundle.js');
const fs = require('fs');
let server = require(`../../server.json`);
const helpers = require('../shared/helpers/helpers.js')
module.exports = {
    name: 'roll',
    system: 'dnd5',
    description: 'Rolls dice. With no arguments, rolls 1d20. Stat names can substitute for numbers, using your stats. If given d notation, rolls those dice.',
    execute(message, args) {
        if (args.length == 0) {
            roll = new DiceRoll(`d20`)
            results = roll.output;
            message.channel.send("`" + results + "`");
        }
        else if (args.length == 1 && args[0].match(/(?:\d+d|d+\d)[d\d]*/g)) {
            let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
            character = game.party.filter(x => x.playerid == message.author.id)[0];
            let rollString = args[0].toLowerCase();
            let rolls = args[0].toLowerCase().split(/\s+|((?<=\W)|(?=\W))/g);
            var convertedRolls = rolls;
            let notations = ['+', '', '-'];
            let notFound = [];
            for (let i in rolls) {
                if (character.hasOwnProperty(rolls[i])) {
                    convertedRolls.splice(i, 1, character[rolls[i]]);
                }
                else if (notations.includes(rolls[i]) || helpers.isNumeric(rolls[i]) || rolls[i].match(/(?:\d+d|d+\d)[d\d]*/g)) {
                }
                else {
                    notFound.push(rolls[i]);
                    if (i == 0) {
                        convertedRolls.splice(i, 1);
                    }
                    else {
                        convertedRolls.splice(i - 2, 3);
                    }
                }
            }
            rollString = convertedRolls.toString().replace(/,/g, '');
            roll = new DiceRoll(rollString);
            var messageString = "`" + roll.output + "`";
            messageString += notFound.length > 0 ? `\nNot Found: ${notFound}` : '';
            message.channel.send(messageString);
        }
        else {
            let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
            character = game.party.filter(x => x.playerid == message.author.id)[0];
            var statString = character[args[0]] ? `${character[args[0]]>0 ? "+" : ""}${character[args[0]]}` : '';
            roll = new DiceRoll(`d20${statString}`);
            message.channel.send("`" + roll.output + "`");
        }
        
    },
};

