const Discord = require('discord.js');
const { attributes, skills } = require('./system.json');
const fs = require('fs');
const helpers = require('../shared/helpers/helpers.js');
let server = require(`../../server.json`);
module.exports = {
    name: 'sheet',
    system: 'nwod',
    description: "Show the character's sheet. Show your character's by default, or specify a name.",
    execute(message, args) {
        let game = JSON.parse(fs.readFileSync(`./games/${server[message.channel.id]}.json`));
        let party = game.party;
        if (args.length == 0) {
            var character = party.filter(x => x.playerid == message.author.id)[0]
            message.channel.send(buildSheet(character));
        }
        else {
            let characterName = '';
            for (let i = 0; i < args.length; i++) {
                if (i != 0){
                    characterName += ' ';
                } 
                characterName += args[i];
            }
            var character = party.filter(x => x.name.toLowerCase().includes(characterName.toLowerCase()))[0]
            if (character) {
                message.channel.send(buildSheet(character));
            }
            else {
                message.channel.send("Who? Try !party and pick an existing character.");
            }
        }

        function buildSheet(character) {
            let member = message.guild.member(character.playerid);
            var characterSheet = new Discord.MessageEmbed()
                .setColor(character.color ? character.color : '#0099ff')
                .setTitle(character.name ? character.name : "An unnamed character")
                .setAuthor(member ? member.nickname ? member.nickname : member.user.username : "nobody", member ? member.user.avatarURL() : '')
                .setDescription(character.description ? character.description : "description")
                .setThumbnail(character.image ? character.image : null)
            for (let attribute of attributes) {
                characterSheet.addField(attribute, character[attribute.toLowerCase()], true);
            }
            characterSheet.addField('\u200B', '\u200B', false);
            for (let skill of skills) {
                if (character.hasOwnProperty(skill.toLowerCase())) {
                    characterSheet.addField(skill, character[skill.toLowerCase()], true);
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

