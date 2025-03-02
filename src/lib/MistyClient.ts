import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { Client } from 'discord.js';
import 'dotenv/config';
import { registerCommands } from './Command';

class MistyClient extends Client {
    cluster: ClusterClient;
    constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            intents: [
                "MessageContent",
                "GuildMessages",
                "Guilds"
            ]
        })
        this.cluster = new ClusterClient(this);

        registerCommands();
    }

    async login(): Promise<string> {
        return await super.login(process.env["DISCORD_TOKEN"]);
    }
}

export default MistyClient;