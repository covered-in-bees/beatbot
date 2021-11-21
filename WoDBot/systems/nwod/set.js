const fs = require('fs');
let server = require(`../../server.json`);
let { aliases, fullName } = require(`./system.json`);
module.exports = {
    name: 'set',
    system: 'nwod',
    description: "Set your character's stats, attributes, descriptions, whatever! Arg1 = property, Arg2 = value. Try image <link> and color <hex value>!",
    execute(interaction, client) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[interaction.channel_id]}.json`));
        let party = game.party;
        let attribute = interaction.data.options[0].value;
        let value = interaction.data.options[1].value;
        if (attribute == "playerid") {
        }
        else if (attribute == "character") {
            let newChar = JSON.parse(value);
            newChar.playerid = interaction.member.user.id;
            let oldChar = party.filter(x => x.playerid == newChar.playerid).find(Boolean);
            if (oldChar) {
                newChar = Object.assign(oldChar, newChar);
                let index = party.findIndex(x => x.playerid == newChar.playerid);
                party[index] = newChar;
            }
            else {
                party.push(newChar);
            }
            let data = JSON.stringify(game);
            fs.writeFile(`games/${game.name}.json`, data, (err) => { if (err) throw err; });
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: 'Character updated!'
                    }
                }
            });
        }
        else {
            //create new character if user doesn't have one
            if (party.filter(x => x.playerid == interaction.member.user.id).length == 0) {
                party.push({ playerid: interaction.member.user.id })
            }
            //get character of user
            character = party.filter(x => x.playerid == interaction.member.user.id)[0];
            if (fullName.hasOwnProperty(attribute.toLowerCase())) {
                character[fullName[attribute.toLowerCase()]] = value;
            }
            else {
                character[attribute.toLowerCase()] = value;
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
                interaction.reply({
                    content: `Your ${attribute} is now ${value}. Don't forget to set a name!`,
                    ephemeral: true
                })
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `Your ${attribute} is now ${value}. Don't forget to set a name!`
                        }
                    }
                });
            }
            else {
                interaction.reply({
                    content: `${character.name}'s ${attribute} is now ${value}.`,
                    ephemeral: true
                })
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `${character.name}'s ${attribute} is now ${value}.`
                        }
                    }
                });
            }
        }
    },
};

