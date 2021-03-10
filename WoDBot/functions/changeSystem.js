const fs = require('fs');
function changeSystem(gameSystem) {
    client.commands = new Discord.Collection();
    const systemFolder = fs.readdirSync('../systems').filter(folder => folder == gameSystem);
    const commandFiles = fs.readdirSync(`../systems/${systemFolder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        console.log(file);
        const command = require(`../systems/${systemFolder}/${file}`);
        client.commands.set(command.name, command);
    }
    const sharedFiles = fs.readdirSync(`../systems/shared`).filter(file => file.endsWith('.js'));
    for (const file of sharedFiles) {
        console.log(file);
        const command = require(`../systems/shared/${file}`);
        client.commands.set(command.name, command);
    }
    let party = require(`../systems/${systemFolder}/party.json`);
    global.party = party;
}

module.exports = changeSystem();