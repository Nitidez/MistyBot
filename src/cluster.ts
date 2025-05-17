import { ClusterManager } from "discord-hybrid-sharding";
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {setupManagerIPC, getClusterName} from '@/lib/shardNames';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = process.env["NODE_ENV"] === 'production';
const botFile = `${__dirname}/bot.${isProd ? 'js' : 'ts'}`;

const manager = new ClusterManager(botFile, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env["DISCORD_TOKEN"],
    execArgv: isProd ? [] : [...process.execArgv],
});

setupManagerIPC(manager);

manager.on('debug', msg => console.log(`[Cluster-Debug] ${msg}`));
manager.on('clusterCreate', async cl => {
    console.log(`Launched Cluster #${cl.id} (${await getClusterName(cl.id)})`);
    process.on("exit", () => cl.kill({force: true}));
});

manager.spawn({ timeout: -1 });