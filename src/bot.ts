import 'dotenv/config';
import { ActivityType, Client, IntentsBitField, Partials } from 'discord.js';

let client = new Client({ intents: [
    "Guilds",
    "DirectMessages",
    "MessageContent"
], partials: (Object.values(Partials).filter(a=>typeof a=='string') as Array<Partials>),
presence: {
    status: "dnd",
    activities: [
        {
            type: ActivityType.Streaming,
            name: '❤️!',
            url: 'https://www.twitch.tv/nitidezjoga'
        }
    ]
}})

client.once('ready', async () => (await import('./listeners/ready')).run(client));
client.on('interactionCreate', async (interaction) => (await import('./listeners/interactionCreate')).run(interaction))

client.login(process.env.DISCORD_TOKEN);