import MistyClient from "@/lib/MistyClient";
import { getShardName } from "./lib/shardNames";

const client = new MistyClient();

client.on('ready', async () => {
    const sId = client.guilds.cache.first()?.shardId;
    console.log(`Shard #${sId} (${await getShardName(sId as number)}) is ready.`)
} )

client.login();