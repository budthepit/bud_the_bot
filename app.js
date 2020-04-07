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
  
  // commands and inputs
  const commandArray = msg.trim().toLowerCase().split(' ');  
  const commandName = commandArray[0];
  
  // User Level / permission //
  // isMod and isBrodcaster - checks is isMod and isBrodcaster are true of false
  const isMod = userstate.mod;

  //isBroadcaster
  function checkIfBroadcaster(userstate) {
    if (userstate['room-id'] !== userstate['user-id']) {
      return false;      
    } else if (userstate['room-id'] === userstate['user-id']) { // userstate.room-id === userstate.user-id
      return true;
    }
  }
  const isBroadcaster = checkIfBroadcaster(userstate);  
  
  // isSub true or false
  const isSub = userstate.subscriber;
  
  // isVIP    
  function checkIfVIP(userstate) {
    if ( isBroadcaster || userstate.badges === null ) {
      return false;      
    } else if (userstate.badges.vip === '1') {
      return true;
    }
  }
  const isVIP = checkIfVIP(userstate);

  // Variables  //
  const botName = process.env.BOT_USER_NAME_DISPLAY;
  const userName = `@${userstate['display-name']}`;
  const firstInput = commandArray[1];
  
  //* ---------------    Commands    ---------------- *  
  
  // !commands command
  if (commandName === '!commands') {    
    client.say(channel, `!dice !coinflip !hug`);
    console.log(`* Executed ${commandName} command`);
  }
  // !dice command
  else if (commandName === '!dice') {
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
  // !hug  
  else if (commandName === '!hug') {
    if ( commandArray[1] === undefined) {
      client.say(channel, `/me ${userName} gives all of you hugs GivePLZ <3 TakeNRG`);
      console.log(`* Executed ${commandName} command`);
      return;
    }        
    client.say(channel, `/me ${userName} gave ${firstInput} a hug GivePLZ <3 TakeNRG`);
    console.log(`* Executed ${commandName} command with parameter`);
    return;
  }  
  // else Unknown command
  else {
    //console.log(`* unknown ${commandName}`);
    return;
  }
  
}
// ######## Woker Functions #######

// Function called when the "!dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Function called when the "!coinflip" command is issued
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
  // client.action( opts.channels , `MrDestructoid ${process.env.BOT_USER_NAME} Has connected`);
}