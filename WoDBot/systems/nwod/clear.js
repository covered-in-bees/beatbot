const fs = require('fs');
let server = require(`../../server.json`);
module.exports = {
    name: 'clear',
    system: 'nwod',
	description: 'kill all beats',
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        game.beats = 0
        message.channel.send('Your beats desert you.');
        let data = JSON.stringify(game);
        fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
	},
};