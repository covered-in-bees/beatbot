const Discord = require('discord.js');
const { stats, disposition } = require('./game.json');
const helpers = require('../shared/helpers/helpers.js');
let party = require(`./party.json`);
module.exports = {
    name: 'sheet',
    system: 'lnf',
    description: `Show the character's Lasers and Feelings sheet. Show your character's by default, or specify a name.`,
    execute(message, args) {
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
                .setAuthor(member ? member.nickname ? member.nickname : member.user.username : "nobody", member ? member.user.avatarURL() : '')
                .setDescription(character.description ? character.description : "description")
                .setThumbnail(character.image ? character.image : null)
            var dispositionString = `${character.number}\n${stats.lasers}${disposition[character.number]}${stats.feelings}`
            characterSheet.addField('Number', dispositionString);
            for (var [key, value] of Object.entries(character)) {
                if (!['name', 'color', 'description', 'number', 'image', 'playerid'].includes(key)) {
                    characterSheet.addField(helpers.capitalize(key), value, true);
                }
            }
            return characterSheet
        }
    },
};

