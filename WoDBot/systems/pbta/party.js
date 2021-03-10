let party = require(`./party.json`);
module.exports = {
    name: 'party',
    system: 'pbta',
    description: "who's in the party?",
    execute(message, args) {
        characters = [];
        console.log(party);
        for (let character of party) {
            characters.push(character.name ? character.name : 'Unnamed Character')
        }
        message.channel.send(characters);
    },
};

