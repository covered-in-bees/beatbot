const fs = require('fs');
let server = require(`../../server.json`);
module.exports = {
    name: 'beats',
    system: 'nwod',
	description: 'give count of beats',
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        message.channel.send('You see ' + game.beats.toString() + ' beats.');
	},
};