const { moves, basic_moves, classes } = require('./moves.json');
const { classNames } = require('./system.json');
const { prefix } = require('../../config.json');
module.exports = {
    name: 'move',
    system: 'pbta',
	description: 'learn about the moves',
    execute(message, args) {
        const data = [];
        if (!args.length) {
            data.push(`The basic moves are ${basic_moves.map(x => x.name).join(', ')}.`);
            data.push(`For a detailed description, try "${prefix}move <move name>".`);
        }
        else if (args.length == 1 && classNames.includes(args[0].toLowerCase())) {
            let startingMoves = classes[args[0].toLowerCase()].starting_moves.map(x => x.name).join(', ')
            let advancedMoves = classes[args[0].toLowerCase()].advanced_moves_1.map(x => x.name).join(', ')
            let advanced2Moves = classes[args[0].toLowerCase()].advanced_moves_2.map(x => x.name).join(', ')
            data.push(`**${args[0]} Starting Moves** are ${startingMoves}.`);
            data.push(`**Advanced Moves** are ${advancedMoves}.`);
            data.push(`**Very Advanced Moves** are ${advanced2Moves}.`);
            data.push(`For a detailed description, try "${prefix}move <move name>".`)
        }
        else {
            //combine arguments & format string to key
            let moveName = args.join('_').toLowerCase()
            moveName = moveName.replace('&', 'and').replace('-', '_').replace('ä', 'a').replace(/[^\w\s]|/g, "").replace(/\s+/g, " ");
            if (moveName == "cast_a_spell") {
                data.push(`Try "${prefix}move cast a spell <classname>" to get your class-specific move.`);
            }
            else if (moves.hasOwnProperty(moveName)) {
                data.push(`**Name:** ${moves[moveName].name}`);
                data.push(`**Description:** ${moves[moveName].description}`);
                if (moves[moveName].classes) data.push(`**Classes:** ${moves[moveName].classes.join(', ')}`);
            }
            else {
                data.push(`Move not found.`);
            }
        }
        message.channel.send(data, { split: true })
	},
};