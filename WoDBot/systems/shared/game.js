var config = require('../../config.json');
const fs = require('fs');
var gameFiles = fs.readdirSync('./games');
const systems = fs.readdirSync('./systems').filter(folder => folder != 'shared');
var games = [];
for (let game of gameFiles) {
    game = require(`../../games/${game}`);
    games.push(game);
};
var server = require('../../server.json');
module.exports = {
    name: 'game',
    description: `Add new games/campaigns. Existing games are: ${games.map(game => game.name).join(', ')}`,
    execute(message, args) {
        if (!args.length) {
            message.channel.send(`Existing games are: ${games.map(game => game.name).join(', ')}`);
        }
        else if (args.length < 2) {
            message.channel.send(`Create a new game with: !game <game-name-in-kebab-case> <system> <@gm>.`);
        }
        else if (!systems.includes(args[1])) {
            message.channel.send(`Supported systems are: ${systems.join(', ')}`);
        }
        else {
            if (games.map(game => game.name).includes(args[0].toLowerCase()) && systems.includes(args[1])) {
                //update json
                var game = games.map(game => game.name).includes(args[0].toLowerCase())
                game.system = args[1]
                if (args[2]) {
                    game.gm = args[2]
                }
                let data = JSON.stringify(game);
                fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
                message.channel.send(`${game.name} updated.`);
            }
            else {
                var game = new Object();
                game.name = args[0]
                game.system = args[1]
                game.gm = args[2]
                game.party =[]
                let data = JSON.stringify(game);
                fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
                server[message.channel.id] = game.name;
                let serverData = JSON.stringify(server);
                fs.writeFile(`server.json`, serverData, (err) => { if (err) throw err; });
                message.channel.send(`${game.name} added.`);
            }
        }
    },
};

