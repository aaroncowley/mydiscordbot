const { join } = require('node:path');
const { Events, Client, VoiceChannel, GatewayIntentBits, Collection } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const { token } = require('./config.json');

const player = createAudioPlayer();

function playSong() {
    console.log('playing the fart');
    const resource = createAudioResource(join(__dirname, 'important.mp3'));
    player.play(resource);
    return entersState(player, AudioPlayerStatus.Playing, 5000);
}

async function connectToChannel(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

        return connection;
    }
    catch (error) {

        connection.destroy();
        throw error;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.login(token);

client.on('ready', async () => {
    console.log('Discord.js client is ready!');
});

client.on('messageCreate', async (message) => {
    if (!message.guild) {
        console.log('oops');
    }

    if (message.content === 'fart') {
        const channel = message.member?.voice.channel;

        if (channel) {
            try {
                const connection = await connectToChannel(channel);
                connection.subscribe(player);
                await playSong();
                message.reply('Playing now!');
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            message.reply('Join a voice channel then try again!');
        }
    }

});
