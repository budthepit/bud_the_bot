const tmi = require('tmi.js');
const fs = require('fs');
const { prefix } = require('./config.json');
const commandList = require('./commands/commands');
const Command  = require('../models/Command');
const Channel = require('../models/Channel');
require('dotenv').config();

const channelList = [ process.env.CHANNEL_USER_NAME  ]; 
const opts = {  
	connection: {
		reconnect: true,
		secure: true
	},
  identity: {
    username: process.env.BOT_USER_NAME,
    password: process.env.PASS_OAUTH
  },
  channels: channelList
}

const client = new tmi.client(opts);
client.connect().catch(console.error);;

client.on('message', (channel, userstate, msg, self)=> {  
  if (self) { return; } // Ignore messages from the bot
  // commands and inputs
  const commandArray = msg.trim().split(' ');  
  const commandName = commandArray[0].toLowerCase();
  
  const checkIfIsCommand = (command) => {    
    const n = command.search(prefix);
    if (n == 0) {
      return true;
    } else {
      return false;
    }
  }
  const getResponseString = ( lengthAmount, message) => {
    const result = message.substring(lengthAmount)
    return result;
  }
  //isBroadcaster
  const checkIfBroadcaster = (userstate)=> {
    if (userstate['room-id'] !== userstate['user-id']) {
      return false;      
    } else if (userstate['room-id'] === userstate['user-id']) {
      return true;
    }
  }
  const isBroadcaster = checkIfBroadcaster(userstate);  
  // isSub true or false
  const isSub = userstate.subscriber;
  const isMod = userstate.mod || isBroadcaster;
  // isVIP    
  const checkIfVIP = (userstate)=> {
    if ( isBroadcaster || userstate.badges === null ) {
      return false;      
    } else if (userstate.badges.vip === '1') {
      return true;
    }
  }
  const isVIP = checkIfVIP(userstate);
  // Variables  //
  const botName = process.env.BOT_USER_NAME_DISPLAY;
  // const userName = `${userstate['display-name']}`;
  // const mentionUser = `@${userstate['display-name']}`;
  // const firstInput = commandArray[1];
  // const secondInput = commandArray[2];
  // const thirdInput = commandArray[3];
  // const forthInput = commandArray[4];  
  
  const isCommand = checkIfIsCommand(commandName);
  if (isCommand) {
    commandList.map(command=> {
      if(command.name === commandName && command.active) {
  
        if(command.modOnly && isMod) {
          if(command.hasArgs) {
            const commandsArg = getResponseString(commandArray[0].length + commandArray[1].length + commandArray[2].length + 3, msg)
            command.execute(client , channel, userstate, commandArray, commandsArg);
          } else {
            command.execute(client , channel , userstate);
          }
        } else if(!command.modOnly) {
          if(command.hasArgs) {
            command.execute(client , channel, userstate, commandArray );
          } else {
            command.execute(client , channel , userstate);
          }
        }
      }
    });
    const channelID = userstate['room-id'];
    Command.find({channel_id: channelID},(err, commandObj)=> {
      for (const command in commandObj) {
          let commandArray =  [];
          if (Object.hasOwnProperty.call(commandObj, command)) {
              const currentCommand = commandObj[command];
              commandArray.push(currentCommand._doc)
          }
          if (commandArray.length > 0) {
            commandArray.map((commDB)=> {
              const currentCommand = commandName.substring(1);
              if (commDB.name === currentCommand) {
                client.say(channel, `${commDB.response}`);
              }
            });
            
          }
      }
    });
  }
});
// New sub
client.on("subscription", (channel, username, method, message, userstate) => {
  const channelID = userstate['room-id'];
  Channel.findOne({channel_id: channelID},(err, channelObj)=> {
    if (!err) {
      if(channelObj.settings.resub_alert) {
        client.say(channel, `@${username} thank you for subscribing <3`);
      }      
    }
  })
});

// Resub
client.on("resub", (channel, username, months, message, userstate, methods) => {  
  const cumulativeMonths = userstate["msg-param-cumulative-months"];
  const channelID = userstate['room-id'];
  Channel.findOne({channel_id: channelID},(err, channelObj)=> {
    if (!err) {
      if(channelObj.settings.resub_alert) {
        client.say(channel, `@${username} thank you for resubscribing for ${cumulativeMonths} months <3`);
      }      
    }
  })
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  const channelID = userstate['room-id'];
  Channel.findOne({channel_id: channelID},(err, channelObj)=> {
    if (!err) {
      if(channelObj.settings.giftsub_alert) {
        client.say(channel, `${userstate["system-msg"]}`);
      }      
    }
  })
});

// Called every time the bot connects to Twitch chat
client.on('connected', (addr, port)=> {
  console.log(`* Connected to ${addr}:${port}`);
});