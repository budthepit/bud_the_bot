module.exports = [
    {
        name: "!test",
        active: true,
        modOnly: false,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel) {
            client.say(channel, `I am functioning within normal parameters MrDestructoid`)
        }
    },
    {
        name: "!ping2",
        active: false,
        modOnly: false,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel) {
            client.say(channel, `This is a ping!`)
        }
    },
    {
        name: "!modonly",
        active: true,
        modOnly: true,
        hasArgs: false,
        cooldown: 0,
        execute(client, channel) {
            client.say(channel, `This is a Mod Only command :p!`)
        }
    },
    {
        name: "!timeout",
        active: false,
        modOnly: true,
        hasArgs: true,
        cooldown: 0,
        execute(client, channel, args) {
            if (!args[0]) {
                client.say(channel, `No user name given`)
            } else if (args[1]) {
                client.say(channel, `/timeout ${args[0]} ${args[1]}`)
            } else if (args[0] && !args[1]) {
                client.say(channel, `/timeout ${args[0]}`)
            }
        }
    },
    {
        name: "!coinflip",
        active: true,
        modOnly: false,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel) {
            const coinFlip = ()=> {
                const sides = 2;
                let num = Math.floor(Math.random() * sides) + 1;
                if (num == 1) {
                  return num = 'Heads';
                } else if (num == 2) {
                  return num = 'Tails';
                }
            }
            const result = coinFlip();
            client.say(channel, `You have flipped a ${result}`);
        }
    }
];