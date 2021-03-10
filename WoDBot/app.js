const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
var { system, game } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();
//initialize commands with default game system
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./systems').filter(folder => folder != 'shared');;
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./systems/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./systems/${folder}/${file}`);
        client.commands.set(folder + '.' + command.name, command);
    }
}
const sharedFiles = fs.readdirSync(`./systems/shared`).filter(file => file.endsWith('.js'));
var sharedCommands = []
for (const file of sharedFiles) {
    const command = require(`./systems/shared/${file}`);
    client.commands.set(command.name, command);
    sharedCommands.push(command.name);
}
//set globals
//TODO: initialize party as array of Characters
global.gameSystem = system;
global.beats = 0;

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
});

//discord app token
client.login(token);

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    var commandName = args.shift().toLowerCase();
    if (!commandName.includes('.') && !sharedCommands.includes(commandName)) {
        commandName = gameSystem + '.' + commandName;
    }

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
});
