const fs = require('fs');
let server = require(`../../server.json`);
module.exports = {
    name: 'delete',
    description: "Delete your characters. Enter the character's full name to delete them.",
    execute(message, args) {
        if (args.length == 0) {
            message.channel.send("Delete what?");
        }
        //else if (args[0].toLowerCase() != "character" && args[0].toLowerCase() != "game") {
        //    message.channel.send('Delete what? Try "character" or "game".');
        //}
        //else if (args[0].toLowerCase() == "character")
        else
        {
            game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
            //characterName = args.slice(1).join(' ');
            characterName = args.join(' ');
            if (game.party.filter(x => x.name == characterName).length > 0) {
                let character = game.party.filter(x => x.name == characterName).find(Boolean);
                console.log(message.author.id);
                console.log(character.playerid);
                if (message.author.id == character.playerid || message.author.id == game.gm) {
                    //remove character from party
                    game.party = game.party.filter(x => x.name != characterName);
                    let data = JSON.stringify(game);
                    fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
                    message.channel.send(`Goodbye, ${characterName}!`);
                }
                else {
                    message.channel.send("Only the GM or the player can delete a character.");
                }
            }
            else {
                message.channel.send("Character not found.");
            }
        }

    },
};

