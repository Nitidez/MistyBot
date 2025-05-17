import animals from "@/animals.json";
import ores from "@/ores.json";

const isPrimaryProcess = !process.send;

const clusterNames: Record<number, string> = {};
const shardNames: Record<number, string> = {};
const usedClusterNames = new Set<string>();
const usedShardNames = new Set<string>();
let fullClusterNamesIndex = 0;
let fullShardNamesIndex = 0;

function getClusterNameLocal(id: number): string {
  if (!(id in clusterNames)) {
    const available = ores.filter(o => !usedClusterNames.has(o));
    if (available.length === 0) {
      fullClusterNamesIndex++;
      usedClusterNames.clear();
      return getClusterNameLocal(id);
    }
    const randomName = available[Math.floor(Math.random() * available.length)];
    clusterNames[id] = `${randomName}-${fullClusterNamesIndex + 1}`;
    usedClusterNames.add(randomName);
  }
  return clusterNames[id];
}

function getShardNameLocal(id: number): string {
  if (!(id in shardNames)) {
    const available = animals.filter(a => !usedShardNames.has(a));
    if (available.length === 0) {
      fullShardNamesIndex++;
      usedShardNames.clear();
      return getShardNameLocal(id);
    }
    const randomName = available[Math.floor(Math.random() * available.length)];
    shardNames[id] = `${randomName}-${fullShardNamesIndex + 1}`;
    usedShardNames.add(randomName);
  }
  return shardNames[id];
}

export function setupManagerIPC(manager: import("discord-hybrid-sharding").ClusterManager) {
  manager.on("clusterCreate", (cluster) => {
    cluster.on("message", (msg: any) => {
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "getClusterName") {
        const name = getClusterNameLocal(msg.id);
        cluster.send({ type: "response", id: msg.id, name });
      } else if (msg.type === "getShardName") {
        const name = getShardNameLocal(msg.id);
        cluster.send({ type: "response", id: msg.id, name });
      }
    });
  });
}

function requestNameIPC(type: "getClusterName" | "getShardName", id: number): Promise<string> {
  if (isPrimaryProcess)
    return Promise.reject(new Error("Não chame requestNameIPC no processo pai principal"));

  return new Promise((resolve, reject) => {
    function onMessage(msg: any) {
      if (msg?.type === "response" && msg.id === id) {
        process.off("message", onMessage);
        resolve(msg.name);
      }
    }
    process.on("message", onMessage);
    process.send?.({ type, id });
    setTimeout(() => {
      process.off("message", onMessage);
      reject(new Error("Timeout no pedido IPC de nome"));
    }, 5000);
  });
}

export function getClusterName(id: number): string | Promise<string> {
  if (isPrimaryProcess) {
    return getClusterNameLocal(id);
  } else {
    return requestNameIPC("getClusterName", id);
  }
}

export function getShardName(id: number): string | Promise<string> {
  if (isPrimaryProcess) {
    return getShardNameLocal(id);
  } else {
    return requestNameIPC("getShardName", id);
  }
}