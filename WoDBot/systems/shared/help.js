const { prefix } = require('../../config.json');
const fs = require('fs');
const server = require('../../server.json');
const gameFiles = fs.readdirSync('./games');
var games = [];
for (let game of gameFiles) {
    game = require(`../../games/${game}`);
    games.push(game);
};
module.exports = {
	name: 'help',
	description: 'list commands',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        var system;
        if (server.hasOwnProperty(message.channel.id)) {
            system = games.filter(x => x.name == server[message.channel.id])[0].system;
        }
        if (!args.length) {
            data.push(`a list of commands:`);
            data.push(commands.filter(command => command.system == system || !command.system).map(command => command.name).join(', '));
            data.push(`\ndo a \`${prefix}help [command name]\` to learn specifics.`);
        }
        else {
            const name = `${args[0].toLowerCase()}`;
            const command = commands.get(name) ? commands.get(name) : commands.get(`${system}.${name}`);

            if (!command) {
                return message.channel.send('who told you about that one?');
            }
            else {

                data.push(`**Name:** ${command.name}`);

                if (command.description) data.push(`**Description:** ${command.description}`);
            }
        }
        message.channel.send(data, {split: true});
    },
};