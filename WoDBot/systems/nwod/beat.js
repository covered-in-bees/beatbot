module.exports = {
    name: 'beat',
    system: 'nwod',
	description: 'take a beat',
    execute(message, args) {
        if (args && args[0] && args[0] != 1) {
            beats = beats + parseInt(args[0]);
            message.channel.send('Take ' + (args[0] != 1 ? args[0].toString() : 'a') + ' beat' + (args[0] != 1 ? 's' : '') + '. New total: ' + beats.toString());
        }
        else {
            beats++;
            message.channel.send('Take a beat. New total: ' + beats.toString());
        }
        
	},
};