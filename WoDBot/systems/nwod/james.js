module.exports = {
    name: 'james',
    system: 'nwod',
    description: 'show that horrid doctor',
    execute(message, args) {
        message.channel.send('Dr. James-ish', {
            files: [
                "./systems/nwod/resources/james.png"
            ]
        });
    },
};