const tmi = require('tmi.js');
const commandList = require('./commands/commands');
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
  const userName = `${userstate['display-name']}`;
  const mentionUser = `@${userstate['display-name']}`;
  const firstInput = commandArray[1];
  const secondInput = commandArray[2];
  const thirdInput = commandArray[3];
  const forthInput = commandArray[4];
  
  commandList.map(command=> {
    if(command.name === commandName && command.active) {
      if(command.modOnly && isMod) {
        if(command.hasArgs) {
          command.execute(client , channel, [firstInput, secondInput, thirdInput, forthInput] );
        } else {
          command.execute(client , channel);
        }
      } else if(!command.modOnly) {
        if(command.hasArgs) {
          command.execute(client , channel, [firstInput, secondInput, thirdInput, forthInput] );
        } else {
          command.execute(client , channel);
        }
      }
    }
  })  
});
// New subscription
client.on("subscription", (channel, username, method, message, userstate) => {    
    client.say(channel, `@${username} thank you for subscribing <3`);
});
// Resub
client.on("resub", (channel, username, months, message, userstate, methods) => {  
  const cumulativeMonths = userstate["msg-param-cumulative-months"];  
  client.say(channel, `@${username} thank you for resubscribing for ${cumulativeMonths} months <3`);
});
// Subgift
client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  client.say(channel, `${userstate["system-msg"]}`);
});

client.on('connected', (addr, port)=> {
  console.log(`* Connected to ${addr}:${port}`);
});