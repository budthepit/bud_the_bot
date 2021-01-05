const Command  = require('../../models/Command');
Command.find({},(err, commandObj)=> {
    for (const command in commandObj) {
        let commandArray =  [];
        if (Object.hasOwnProperty.call(commandObj, command)) {
            const currentCommand = commandObj[command];
            commandArray.push(currentCommand._doc)
        }
    }
});