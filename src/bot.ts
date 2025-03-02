import MistyClient from '@/lib/MistyClient';
import { getShardName } from '@/utils';
import Events from './listeners/Events';
import { getInfo } from 'discord-hybrid-sharding';

const client = new MistyClient();

client.on("ready", async () => {
    const sId = (client.guilds.cache.first()?.shardId ?? 0) + getInfo().FIRST_SHARD_ID;
    console.log(`Shard #${sId} (${await getShardName(sId, client)}) is ready.`);
    await Events.ready(client);
});

client.on("messageCreate", (msg) => Events.messageCreate(client, msg));

client.login();