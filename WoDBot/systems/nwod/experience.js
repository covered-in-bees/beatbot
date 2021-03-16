const { experience } = require('./system.json');
module.exports = {
    name: 'experience',
    system: 'nwod',
	description: 'read experience amount',
    execute(message, args) {
        message.channel.send(`So far, there are ${experience} experiences.`);
	},
};