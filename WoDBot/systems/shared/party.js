const fs = require('fs');
let server = require(`../../server.json`);
module.exports = {
    name: 'party',
    description: "who's in the party?",
    execute(message, args) {
        var game
        if (args.length > 0) {

        }
        else {
            game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        }
        if (game) {
            characters = [];
            for (let character of game.party) {
                characters.push(character.name ? character.name : 'Unnamed Character')
            }
            message.channel.send(characters);
        }
        else {
            message.channel.send("No game found.");
        }

    },
};

