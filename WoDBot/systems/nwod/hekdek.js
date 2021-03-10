module.exports = {
    name: 'twincest',
    system: 'nwod',
    description: 'they sure look like twins',
    execute(message, args) {
        message.channel.send('They are lovers? .0.', {
            files: [
                "./systems/nwod/resources/hekdek.png"
            ]
        });
    },
};