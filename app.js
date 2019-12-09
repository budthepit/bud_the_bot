const tmi = require('tmi.js');
require('dotenv').config();

const opts = { // Define configuration options
  identity: {
    username: process.env.BOT_USER_NAME,
    password: process.env.PASS_OAUTH
  },
  channels: [
    process.env.CHANNEL_USER_NAME , process.env.CHANNEL_USER_NAME_2 
  ]
}
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (channel, userstate, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  
  const commandArray = msg.trim().toLowerCase().split(' ');  
  const commandName = commandArray[0];
  const userName = `@${userstate['display-name']}`;
  const isMod = userstate.mod === true;
  const isBroadcaster = userstate.badges.broadcaster === '1';

  //* ----------------------------------------------- *
  //* ---------------    Commands    ---------------- *
  //* ----------------------------------------------- *  
  // !dice command
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(channel, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  }
  // !coinflip
  else if (commandName === '!coinflip') {
    let result = coinFlip();    
    client.say(channel, `You flipped ${result}`);
    console.log(`* Executed ${commandName} command`);
  }
  // BudThePit
  else if (commandName === 'budthepit' || '@budthepit') {        
    client.say(channel, `BudThePit <3 you`);
    console.log(`* Executed ${commandName} command`);
  }
  // else Unknown command
  else {
    console.log(`* Unknown command ${commandName}`);
  }
  
}

// ################################
// ######## Woker Functions #######
// ################################

// Function called when the "dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Function called when the "dice" command is issued
function coinFlip() {
  const sides = 2;
  let num = Math.floor(Math.random() * sides) + 1;
  if (num == 1) {
    return num = 'Heads';
  } else if (num == 2) {
    return num = 'Tails';
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    // on connect action message 
    // client.action( opts.channels , "MrDestructoid Bud_The_Bot Has connected");
}