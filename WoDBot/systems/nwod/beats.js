module.exports = {
    name: 'beats',
    system: 'nwod',
	description: 'give count of beats',
    execute(message, args) {
        message.channel.send('You see ' + beats.toString() + ' beats.');
	},
};