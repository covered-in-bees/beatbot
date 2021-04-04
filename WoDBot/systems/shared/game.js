const fs = require('fs');
var gameFiles = fs.readdirSync('./games');
var games = [];
for (let game of gameFiles) {
    game = require(`../../games/${game}`);
    games.push(game);
};
var server = require('../../server.json');
module.exports = {
    name: 'game',
    description: `Report or change the current game/campaign. Existing games are: ${games.map(game => game.name).join(', ')}`,
    execute(message, args) {
        if (!args.length) {
            message.channel.send(`${message.channel.toString()} is playing ${server[message.channel.id]}.`);
        }
        else {
            if (games.map(game => game.name).includes(args[0].toLowerCase())) {
                //update json
                server[message.channel.id] = args[0];
                let data = JSON.stringify(server);
                fs.writeFile(`server.json`, data, (err) => { if (err) throw err; });
                message.channel.send(`${message.channel.toString()} is now playing ${server[message.channel.id]}.`);
            }
            else {
                message.channel.send(`Existing games are: ${games.map(game => game.name).join(', ')}`);
            }
        }
    },
};

