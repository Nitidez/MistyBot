import 'dotenv/config'
import { ClusterManager } from 'discord-hybrid-sharding';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getClusterName, getShardName } from '@/utils'

declare global {
    var ggcn: (id: number) => Promise<string>;
    var ggsn: (id: number) => Promise<string>;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = process.env["NODE_ENV"] === 'production';
const botFile = `${__dirname}/bot.${isProd ? 'js' : 'ts'}`

const manager = new ClusterManager(botFile, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env["DISCORD_TOKEN"],
    execArgv: isProd ? [] : [...process.execArgv]
});

manager.on('clusterCreate', async cluster => console.log(`Launched Cluster #${cluster.id} (${await getClusterName(cluster.id)})`));
manager.spawn({ timeout: -1 });

global.ggcn = getClusterName;
global.ggsn = getShardName;