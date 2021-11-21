const fs = require('fs');
let server = require(`../../server.json`);
let { system, modifiers, attributes, scores } = require(`./system.json`);
module.exports = {
    name: 'set',
    system: 'dnd5',
    description: "Set your character's stats, attributes, descriptions, whatever! Arg1 = property, Arg2 = value. Try <image> <link> and <color> <hex value>!",
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        let party = game.party;
        if (args[0] == "playerid") {
            message.channel.send("naughty!");
        }
        else {
            //create new character if user doesn't have one
            if (party.filter(x => x.playerid == message.author.id).length == 0) {
                party.push({ playerid: message.author.id.toString() })
            }
            //get character of user
            character = party.filter(x => x.playerid == message.author.id)[0];
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
            if (!!modifiers[args[0].toLowerCase()]) {
                character[modifiers[args[0].toLowerCase()]] = Math.floor((parseInt(newValue)-10)/2);
            }
            //get party index of user; if none, add; otherwise replace
            var index = party.findIndex(({ playerid }) => playerid === character.playerid);
            if (index === -1) {
                party.push(character);
            } else {
                party[index] = character;
            }
            //update json
            let data = JSON.stringify(game);
            fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
            //send confirmation message
            if (!character.hasOwnProperty('name')) {
                message.channel.send(`Your ${args[0]} is now ${newValue}. Don't forget to set a name!`);
            }
            else {
                message.channel.send(`${character.name}'s ${args[0]} is now ${newValue}.`);
            } 
        }
    },
};

