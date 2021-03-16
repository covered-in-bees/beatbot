const fs = require('fs');
let server = require(`../../server.json`);
let { aliases, fullName } = require(`./system.json`);
module.exports = {
    name: 'setmy',
    system: 'nwod',
    description: "Set your character's stats, attributes, descriptions, whatever! Arg1 = property, Arg2 = value. Try <image> <link> and <color> <hex value>!",
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        let party = game.party;
        if (args[0] == "playerid") {
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
            if (fullName.hasOwnProperty(args[0].toLowerCase())) {
                character[fullName[args[0].toLowerCase()]] = newValue;
            }
            else {
                character[args[0].toLowerCase()] = newValue;
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

