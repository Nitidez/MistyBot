import { ClusterManager } from "discord-hybrid-sharding";
import 'dotenv/config';
import animals from "@/animals.json";
import ores from "@/ores.json"
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clusterNames: Record<number, string> = {};
const shardNames: Record<number, string> = {};
const usedClusterNames: Set<string> = new Set();
const usedShardNames: Set<string> = new Set();
let fullClusterNamesIndex: number = 0;
let fullShardNamesIndex: number = 0;

function getClusterName(id: number): string {
    if (!(id in clusterNames)) {
        const available = ores.filter(o => !(usedClusterNames.has(o)));
        if (available.length === 0) {
            fullClusterNamesIndex += 1;
            usedClusterNames.clear();
            return getClusterName(id);
        }
        const randomName = available[Math.floor(Math.random() * available.length)];
        clusterNames[id] = randomName+`-${fullClusterNamesIndex + 1}`;
        usedClusterNames.add(randomName);
    }
    return clusterNames[id];
}

function getShardName(id: number): string {
    if (!(id in shardNames)) {
        const available = animals.filter(a => !(usedShardNames.has(a)));
        if (available.length === 0) {
            fullShardNamesIndex += 1;
            usedClusterNames.clear();
            return getShardName(id);
        }
        const randomName = available[Math.floor(Math.random() * available.length)];
        shardNames[id] = randomName+`-${fullShardNamesIndex + 1}`
        usedShardNames.add(randomName);
    }
    return shardNames[id];
}

const isProd = process.env["NODE_ENV"] === 'production';
const botFile = `${__dirname}/bot.${isProd ? 'js' : 'ts'}`

const manager = new ClusterManager(botFile, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env["DISCORD_TOKEN"],
    execArgv: isProd ? [] : [...process.execArgv]
});

manager.on('debug', msg => console.log(`[Cluster-Debug] ${msg}`))
manager.on('clusterCreate', cl => console.log(`Launched Cluster #${cl.id} (${getClusterName(cl.id)})`));
manager.spawn({timeout: -1});

export {getClusterName, getShardName};