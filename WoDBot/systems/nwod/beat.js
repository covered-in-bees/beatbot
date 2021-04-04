const fs = require('fs');
const helpers = require('../shared/helpers/helpers.js')
let server = require(`../../server.json`);
module.exports = {
    name: 'beat',
    system: 'nwod',
	description: 'take a beat',
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        if (args && args[0] && args[0] != 1 && helpers.isNumeric(args[0])) {
            game.beats = game.beats + parseInt(args[0]);
            message.channel.send('Take ' + (args[0] != 1 ? args[0].toString() : 'a') + ' beat' + (args[0] != 1 ? 's' : '') + '. New total: ' + game.beats.toString());
        }
        else {
            game.beats++;
            message.channel.send('Take a beat. New total: ' + game.beats.toString());
        }
        let data = JSON.stringify(game);
        fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
	},
};