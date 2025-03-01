import {getShardName} from "@/cluster";
import MistyClient from "@/lib/MistyClient";

const client = new MistyClient();

client.on('ready', () => {
    const sId = client.guilds.cache.first()?.shardId;
    console.log(`Shard #${sId} (${getShardName(sId as number)}) is ready.`)
} )

client.login();