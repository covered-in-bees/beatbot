const fs = require('fs');
let { system } = require(`./system.json`);
let server = require(`../../server.json`);
module.exports = {
    name: 'setmy',
    system: 'lnf',
    description: "Set your character's stats, attributes, descriptions, whatever! Format as <property> <value>. Try !setmy image <link> and !setmy color <hex value>!",
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        if (args[0] == "playerid") {
        }
        else {
            //create new character if user doesn't have one
            if (game.party.filter(x => x.playerid == message.author.id).length == 0) {
                game.party.push({ playerid: message.author.id.toString() })
            }
            //get character of user
            character = game.party.filter(x => x.playerid == message.author.id)[0];
            //set the new value of given property
            var newValue = ''
            //combine multi-word fields
            for (let i = 1; i < args.length; i++) {
                if (i != 1) {
                    newValue += ' ';
                }
                newValue += args[i];
            }
            character[args[0].toLowerCase()] = newValue;
            //get party index of user; if none, add; otherwise replace
            var index = game.party.findIndex(({ playerid }) => playerid === character.playerid);
            if (index === -1) {
                game.party.push(character);
            } else {
                game.party[index] = character;
            }
            //update json
            let data = JSON.stringify(game);
            fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
            //send confirmation message
            if (!character.hasOwnProperty('name')) {
                message.channel.send(`Your ${args[0]} is now ${newValue}. Don't forget to set a name!`);
            }
            else {
                message.channel.send(`${character.name}'s ${args[0]} is now \`${newValue}\`.`);
            } 
        }
    },
};

