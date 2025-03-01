import {ores, animals} from '@/json/clusterNames'

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

export {getClusterName, getShardName}