const fs = require('fs');
const { DiceRoll } = require('rpg-dice-roller/lib/umd/bundle.js');
let server = require(`../../server.json`);
const { stats } = require('./system.json');
const helpers = require('../shared/helpers/helpers.js')
module.exports = {
    name: 'roll',
    system: 'lnf',
    description: 'Rolls dice. With no arguments, rolls 1d6. Stat names can substitute for numbers, using your stats. If given d notation, rolls those dice.',
    execute(message, args) {
        if (args.length == 0) {
            roll = new DiceRoll(`1d6`)
            results = roll.output;
            message.channel.send("`" + results + "`");
        }
        else if (args.length == 1 && args[0].match(/(?:\d+d|d+\d)[d\d]*/g)) {
            let rollString = args[0].toLowerCase();
            roll = new DiceRoll(rollString);
            var messageString = "`" + roll.output + "`";
            message.channel.send(messageString);
        }
        else if (args[0].toLowerCase() == stats['lasers'].toLowerCase()) {
            let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
            character = game.party.filter(x => x.playerid == message.author.id)[0];
            roll = new DiceRoll(`${args[1] ? args[1] : ''}d6<=${character.number}`)
            results = roll.output.slice(roll.output.indexOf('['));
            results = helpers.formatRollResult(results);
            laserFeelings = results.substring(0, results.length - 1).includes(character.number);
            var messageString = "`" + results + "` successes." + `${laserFeelings ? ' ' + stats.laserFeelings + '!' : ''}`;
            message.channel.send(messageString);

        }
        else if (args[0].toLowerCase() == stats['feelings'].toLowerCase()) {
            let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
            character = game.party.filter(x => x.playerid == message.author.id)[0];
            character = party.filter(x => x.playerid == message.author.id)[0];
            roll = new DiceRoll(`${args[1] ? args[1] : ''}d6>=${character.number}`)
            results = roll.output.slice(roll.output.indexOf('['));
            results = helpers.formatRollResult(results);
            laserFeelings = results.substring(0, results.length - 1).includes(character.number);
            var messageString = "`" + results + "` successes." + `${laserFeelings ? ' ' + stats.laserFeelings + '!' : ''}`;
            message.channel.send(messageString);
        }
        else {
        }
        
    },
};

