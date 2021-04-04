const Discord = require('discord.js');
const fs = require('fs');
const { attributes, skills, descriptors, modifiers, scores } = require('./system.json');
let server = require(`../../server.json`);
module.exports = {
    name: 'sheet',
    system: 'pbta',
    description: "Show the character's PBtA sheet. Show your character's by default, or specify a name.",
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
                .setTitle(character.name ? character.name : "A nameless being...")
                .setAuthor(member ? member.nickname ? member.nickname : member.user.username : "nobody", member ? member.user.avatarURL():'')
                .setDescription(character.description ? character.description : "description")
                .setThumbnail(character.image ? character.image : null)
            var descriptorString = ''
            for (let descriptor of descriptors) {
                descriptorString += character[descriptor] ? `${character[descriptor]} ` : `${descriptor} `;
            }
            characterSheet.addField('\u200B', descriptorString);
            for (let attribute of attributes) {
                characterSheet.addField(attribute, character[attribute.toLowerCase()] + ` (${scores[character[attribute.toLowerCase()]]})`, true);
            }
            for (let skill of skills) {
                if (character.hasOwnProperty(skill.toLowerCase())) {
                    characterSheet.addField(skill, character[skill.toLowerCase()], true);
                }
            }
            characterSheet.setFooter(`${character.sponsor ? `Sponsored by ${character.sponsor} |` : ''} ${character.pronouns ? `${character.pronouns} |` : ''} ${character.xp ? `${character.xp} XP` : ''}`);
            return characterSheet
        }
    },
};

