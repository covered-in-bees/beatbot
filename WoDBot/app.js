const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
//get config vars
const { prefix, token } = require('./config.json');
var { system } = require('./config.json');
var server = require('./server.json');
var gameFiles = fs.readdirSync('./games');
var games = [];
for (let game of gameFiles) {
    game = require(`./games/${game}`);
    games.push(game);
};
// create a new Discord client
const client = new Discord.Client();
//initialize commands
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
        if (system.hasOwnProperty(message.channel.id)) {
            //set command to <default system>.<command>
            commandName = gameSystem + '.' + commandName;
        }
        else {
            //set command to <channel's game system>.<command>
            commandName = games.filter(x => x.name == server[message.channel.id])[0].system + '.' + commandName;
        }
    }

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
});
