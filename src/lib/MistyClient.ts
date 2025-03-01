import { Client } from "discord.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import 'dotenv/config';

class MistyClient extends Client {
    cluster: ClusterClient;
    constructor() {
        console.log(process.env)
        console.log(getInfo());
        super({
            intents: [],
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS
        });
        this.cluster = new ClusterClient(this);
    }

    async login(): Promise<string> {
        return await super.login(process.env["DISCORD_TOKEN"]);
    }
}

export default MistyClient;