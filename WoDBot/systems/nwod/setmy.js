const fs = require('fs');
let party = require(`./party.json`);
let { system } = require(`./game.json`);
module.exports = {
    name: 'setmy',
    system: 'nwod',
    description: "Set your character's stats, attributes, descriptions, whatever! Arg1 = property, Arg2 = value. Try <image> <link> and <color> <hex value>!",
    execute(message, args) {
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
            character[args[0].toLowerCase()] = newValue;
            //get party index of user; if none, add; otherwise replace
            var index = party.findIndex(({ playerid }) => playerid === character.playerid);
            if (index === -1) {
                party.push(character);
            } else {
                party[index] = character;
            }
            //update json
            let data = JSON.stringify(party);
            fs.writeFileSync(`systems/${system}/party.json`, data);
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

