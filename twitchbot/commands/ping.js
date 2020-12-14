module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 10,
    args: false,
	execute(msg, args) {
		// msg.channel.send('Pong.......');
		client.say(channel, `This is a Ping`);
	},
};