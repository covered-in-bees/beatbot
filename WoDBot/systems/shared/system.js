var config = require('../../config.json');
const fs = require('fs');
var systems = fs.readdirSync('./systems').filter(folder => folder != "shared");
module.exports = {
    name: 'system',
    description: `Report or change the current game system. Available systems are: ${systems.join(', ')}. "clear" will remove the global system setting.`,
    execute(message, args) {
        if (!args.length) {
            message.channel.send(`The current system is set to ${gameSystem}.`);
        }
        else if (args[0] === "clear") {

        }
        else {
            if (systems.includes(args[0])) {
                gameSystem = args[0];
                //update json
                config.system = args[0];
                let data = JSON.stringify(config);
                fs.writeFile(`config.json`, data, (err) => { if (err) throw err; });
                message.channel.send(`System set to ${gameSystem}.`);
            }
            else {
                message.channel.send(`Supported systems are: ${systems.join(', ')}`);
            }
        }
    },
};

