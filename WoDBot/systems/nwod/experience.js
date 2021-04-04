const fs = require('fs');
let server = require(`../../server.json`);
module.exports = {
    name: 'experience',
    system: 'nwod',
	description: 'read experience amount',
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        message.channel.send(`So far, there are ${game.experience} experiences.`);
	},
};