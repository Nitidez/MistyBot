import 'dotenv/config'
import { ClusterManager } from 'discord-hybrid-sharding';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getClusterName } from '@/utils'

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

manager.on('clusterCreate', cluster => console.log(`Launched Cluster #${cluster.id} (${getClusterName(cluster.id)})`));
manager.spawn({ timeout: -1 });