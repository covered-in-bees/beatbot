module.exports = {
    name: 'clear',
    system: 'nwod',
	description: 'kill all beats',
    execute(message, args) {
        beats = 0
        message.channel.send('Your beats desert you.');
	},
};