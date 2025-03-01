import MistyClient from '@/lib/MistyClient';
import { getShardName } from '@/utils';

const client = new MistyClient();

client.on("ready", () => {
    const sId = client.guilds.cache.first()?.shardId ?? 0;
    console.log(`Shard #${sId} (${getShardName(sId)}) is ready.`);
});

client.login();