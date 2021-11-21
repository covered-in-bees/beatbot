const { DiceRoll } = require('rpg-dice-roller/lib/umd/bundle.js');
const fs = require('fs');
const helpers = require('../shared/helpers/helpers.js')
let server = require(`../../server.json`);
const { aliases, fullName, attributes, skills, abilities } = require('./system.json');

module.exports = {
    name: 'roll',
    system: 'owod',
    description: 'Rolls dice. Stat names can substitute for numbers, using your stats. If given d notation, rolls those dice.',
    execute(interaction, client) {
        let rollinput = interaction.data.options[0].value.split(" ").join("");
        let target = interaction.data.options.find(x => x.name == 'target');
        let explodes = interaction.data.options.find(x => x.name == 'explodes');
        var messageString = '';
        if (rollinput.length == 0) {
            roll = new DiceRoll(`1d10`)
            results = roll.output;
            messageString = "`" + results + "`";
        }
        else if (rollinput.match(/(?:\d+d|d+\d)[d\d]*/g)) {
            let game = JSON.parse(fs.readFileSync(`./games/${server[interaction.channel_id]}.json`));
            character = game.party.filter(x => x.playerid == interaction.member.user.id)[0];
            let rollString = rollinput.toLowerCase();
            let rolls = rollinput.toLowerCase().split(/\s+|((?<=\W)|(?=\W))/g);
            var convertedRolls = rolls;
            let notations = ['+', '', '-'];
            let notFound = [];
            console.log(rolls);
            for (let i in rolls) {
                if (character && character.hasOwnProperty(rolls[i])) {
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
            messageString = "`" + roll.output + "`";
            messageString += notFound.length > 0 ? `\nNot Found: ${notFound}` : '';
        }
        else if (helpers.isNumeric(rollinput)) {
            roll = new DiceRoll(`${rollinput}d10>=${target ? target.value > 1 ? target.value : 6 : 6}f=1${explodes ? explodes.value > 1 ? '!>='+explodes.value : '' : ''}`)
            results = roll.output.slice(roll.output.indexOf('['));
            results = helpers.formatRollResult(results);
            messageString = "`" + results + " successes.`";
        }
        else {
            let game = JSON.parse(fs.readFileSync(`./games/${server[interaction.channel_id]}.json`));
            character = game.party.filter(x => x.playerid == interaction.member.user.id)[0];
            let rollString = rollinput.toLowerCase();
            let rolls = rollinput.toLowerCase().split(/\s+|((?<=\W)|(?=\W))/g);
            var convertedRolls = rolls;
            let notations = ['+', '', '-'];
            let notFound = [];
            for (let i in rolls) {
                if (character.hasOwnProperty(rolls[i])) {
                    convertedRolls.splice(i, 1, character[rolls[i]]);
                }
                else if (character.hasOwnProperty(fullName[rolls[i]])) {
                    convertedRolls.splice(i, 1, character[fullName[rolls[i]]]);
                }
                else if (talents.hasOwnProperty(rolls[i]) || talents.hasOwnProperty(fullName[rolls[i]])) {
                    convertedRolls.splice(i, 1, 0);
                }
                else if (skills.hasOwnProperty(rolls[i]) || skills.hasOwnProperty(fullName[rolls[i]])) {
                    convertedRolls.splice(i, 1, -1);
                }
                else if (notations.includes(rolls[i]) || helpers.isNumeric(rolls[i])) {
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

            //format for message

            rollString = `${eval(rollString)}d10>=${target ? target.value > 1 ? target.value : 6 : 6}f=1`
            roll = new DiceRoll(rollString);
            results = roll.output.slice(roll.output.indexOf('['));
            results = helpers.formatRollResult(results);
            console.log(results);
            if (results.includes('_') && !results.includes('*')) {
                messageString += "`" + results + "` :headstone: Botch!";
            }
            else if (roll.total == 1) {
                messageString += "`" + results + "` success.";
            }
            else if (roll.total > 4) {
                messageString += "`" + results + "` successes. :eyes: Exceptional!";
            }
            else {
                messageString += "`" + results + "` successes.";
            }
            messageString += notFound.length > 0 ? `\nNot Found: ${notFound}` : '';
        }
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: messageString
                }
            }
        });
    },
};

