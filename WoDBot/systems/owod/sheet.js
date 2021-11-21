const Discord = require('discord.js');
const { attributes, abilities } = require('./system.json');
const fs = require('fs');
let server = require(`../../server.json`);
module.exports = {
    name: 'sheet',
    system: 'owod',
    description: "Show the character's sheet. Show your character's by default, or specify a name.",
    execute(interaction, client) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[interaction.channel_id]}.json`));
        if (interaction.data.options) {
            var name = interaction.data.options.find(x => x.name == 'character');
        }
        let party = game.party;
        if (!name) {
            var character = party.filter(x => x.playerid == interaction.member.user.id)[0]
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            buildSheet(character)
                        ]
                    }
                }
            });
        }
        else {
            var character = party.filter(x => x.name.toLowerCase().includes(name.value.toLowerCase()))[0]
            if (character) {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds: [
                                buildSheet(character)
                            ]
                        }
                    }
                });
            }
            else {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: "Who? Try !party and pick an existing character."
                        }
                    }
                });
            }
        }

        function buildSheet(character) {
            var characterSheet = new Discord.MessageEmbed()
                .setColor(character.color ? character.color : '#0099ff')
                .setTitle(character.name ? character.name : "An unnamed character")
                //.setAuthor(member ? member.nickname ? member.nickname : member.user.username : "nobody", member ? member.user.avatarURL() : '')
                .setDescription(character.description ? character.description : "description")
                .setThumbnail(character.image ? character.image : null)
            let user = client.users.fetch(character.playerid);
            user.then(function (result) {
                characterSheet.setAuthor(result.username, result.displayAvatarURL());
            });
            for (let attribute of attributes) {
                characterSheet.addField(attribute, character[attribute.toLowerCase()], true);
            }
            characterSheet.addField('\u200B', '\u200B', false);
            for (let ability of abilities) {
                if (character.hasOwnProperty(ability.toLowerCase())) {
                    characterSheet.addField(ability, character[ability.toLowerCase()], true);
                }
            }
            if (character.specialties) {
                characterSheet.addField('Specialties', character.specialties);
            }
            if (character.merits) {
                characterSheet.addField('Merits', character.merits);
            }
            return characterSheet
        }
    },
};

