const { prefix } = require('../../config.json');
module.exports = {
	name: 'help',
	description: 'list commands',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(`a list of commands:`);
            data.push(commands.filter(command => command.system == gameSystem || !command.system).map(command => command.name).join(', '));
            data.push(`\ndo a \`${prefix}help [command name]\` to learn specifics.`);
        }
        else {
            const name = `${args[0].toLowerCase()}`;
            const command = commands.get(name) ? commands.get(name) : commands.get(`${gameSystem}.${name}`);

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