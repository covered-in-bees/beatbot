const { DiceRoll } = require('rpg-dice-roller/lib/umd/bundle.js');
const { aliases, untrained, attributes, skills } = require('./game.json');
const helpers = require('../shared/helpers/helpers.js')
let party = require(`./party.json`);
module.exports = {
    name: 'rollmy',
    description: "Roll d10s according to your character's stats.",
    execute(message, args) {
        if (args.length == 0) {
            message.channel.send("MORE ARGS PLEASE");
        }
        else {
            character = party.filter(x => x.playerid == message.author.id)[0];
            let rollString = args[0].toLowerCase();

            ////this code turns -mods into rolls and subtracts successes, but splits up nonstat strings
            //let rolls = args[0].toLowerCase().split(/\s+|((?<=\W)|(?=\W))/g);
            //for (let roll in rolls) {
            //    if (helpers.isNumeric(rolls[roll])) {
            //        rolls[roll] = `${rolls[roll]}d10>=8!>=${args[1] ? args[1] : 10}`
            //    }
            //    else if (character.hasOwnProperty(rolls[roll])) {
            //        rolls[roll] = `${character[rolls[roll]]}d10>=8!>=${args[1] ? args[1] : 10}`
            //    }
            //    else if (character.hasOwnProperty(aliases[rolls[roll]])) {
            //        rolls[roll] = `${character[aliases[rolls[roll]]]}d10>=8!>=${args[1] ? args[1] : 10}`
            //    }
            //}
            //console.log(rolls);
            //rollString = rolls.toString().replace(/,/g, '');

            ////this code combines all stats/numbers into a single roll, but can't handle nonstat strings
            //for (let stat in character) {
            //    rollString = rollString.split(stat).join(character[stat]);
            //    rollString = rollString.split(aliases[stat]).join(character[stat]);
            //    rollString = rollString.split(stat).join(untrained[stat]);
            //}

            //this code does both!
            let rolls = args[0].toLowerCase().split(/\s+|((?<=\W)|(?=\W))/g);
            var convertedRolls = rolls;
            let notations = ['+', '', '-'];
            let notFound = [];
            for (let i in rolls) {
                if (character.hasOwnProperty(rolls[i])) {
                    convertedRolls.splice(i, 1, character[rolls[i]]);
                }
                else if (character.hasOwnProperty(aliases[rolls[i]])) {
                    convertedRolls.splice(i, 1, character[aliases[rolls[i]]]);
                }
                else if (untrained.hasOwnProperty(rolls[i])) {
                    convertedRolls.splice(i, 1, untrained[rolls[i]]);
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
            console.log(convertedRolls);
            rollString = convertedRolls.toString().replace(/,/g, '');
            console.log(rollString);

            //format for message
            if (eval(rollString) < 1) {
                rollString = '1d10=10f=1'
                var chance = true;
            }
            else {
                rollString = `${eval(rollString)}d10>=8!>=${args[1] ? args[1] : 10}`
            }
            roll = new DiceRoll(rollString);
            results = roll.output.slice(roll.output.indexOf('['));
            results = helpers.formatRollResult(results);
            var messageString = ''
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
                    messageString += "`" + results + "` successes. :eyes: Exceptional Success!";
            }
            messageString += notFound.length > 0 ? `\nNot Found: ${notFound}` : '';
            message.channel.send(messageString);
        }
        //else {
        //    function escapeMarkdown(text) {
        //        return text.replace(/((\_|\*|\~|\`|\|){2})/g, '\\$1');
        //    }
        //    character = party.filter(x => x.playerid == message.author.id)[0]
        //    var rollString = '';
        //    var notFound = '';
        //    for (let arg of args) {
        //        if (character.hasOwnProperty(arg)) {
        //            rollString += `${character[arg]}d10>=8!>=10+`;
        //        }
        //        else {
        //            notFound += `${arg} `;
        //        }
        //    }
        //    var messageString = ''
        //    if (rollString.length > 0) {
        //        rollString = rollString.slice(0, -1);
        //        roll = new DiceRoll(rollString);
        //        results = roll.output.slice(roll.output.indexOf('['));
        //        results = escapeMarkdown(results);
        //        messageString = "`" + results + " successes.`"
                
                
        //    }
        //    if (notFound.length > 0) {
        //        messageString += ` Not found: ${notFound}`;
        //    }
        //    message.channel.send(messageString);
        //}
    },
};

