const { DiceRoll } = require('rpg-dice-roller/lib/umd/bundle.js');
const fs = require('fs');
const helpers = require('../shared/helpers/helpers.js')
let server = require(`../../server.json`);
const { aliases, fullName, untrained, attributes, skills } = require('./system.json');

module.exports = {
    name: 'roll',
    system: 'nwod',
    description: 'Rolls dice. With no arguments, rolls 1d10. If given one or two numbers, rolls <first argument> d10s that explode on the second argument (default 10). Stat names can substitute for numbers, using your stats. If given d notation, rolls those dice.',
    execute(interaction, client) {
        let rollinput = interaction.data.options[0].value.split(" ").join("");
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
        else if (helpers.isNumeric(rollinput)){
            roll = new DiceRoll(`${rollinput}d10>=8!>=${explodes ? explodes.value > 1 ? explodes.value : 10 : 10}`)
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
                else if (untrained.hasOwnProperty(rolls[i])) {
                    convertedRolls.splice(i, 1, untrained[rolls[i]]);
                }
                else if (untrained.hasOwnProperty(fullName[rolls[i]])) {
                    convertedRolls.splice(i, 1, untrained[fullName[rolls[i]]]);
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
            if (eval(rollString) < 1) {
                rollString = '1d10=10f=1'
                var chance = true;
            }
            else {
                rollString = `${eval(rollString)}d10>=8!>=${explodes ? explodes.value > 1 ? explodes.value : 10 : 10}`
            }
            roll = new DiceRoll(rollString);
            results = roll.output.slice(roll.output.indexOf('['));
            results = helpers.formatRollResult(results);
            messageString += chance ? "Chance!\n" : '';
            switch (roll.total) {
                case -1:
                    messageString += "`" + results + "` :headstone: Dramatic Failure!";
                    break;
                case 0:
                    messageString += "`" + results + "` successes.";
                    break;
                case 1:
                    messageString += "`" + results + "` success.";
                    break;
                case 2:
                    messageString += "`" + results + "` successes.";
                    break;
                case 3:
                    messageString += "`" + results + "` successes.";
                    break;
                case 4:
                    messageString += "`" + results + "` successes.";
                    break;
                default:
                    messageString += "`" + results + "` successes. :eyes: Exceptional!";
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

