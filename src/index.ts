import 'dotenv/config';
import chalk from 'chalk';
import { ShardingManager } from 'discord.js';
import commandRegister from './components/commandRegister';

console.log(`${chalk.green('[Process]')} Current process is ${chalk.greenBright(`${process.env.NODE_ENV === "production" ? "production" : "development"}`)}.`)

const manager = new ShardingManager(__dirname + '/bot.' + (process.env.NODE_ENV === "production" ? "js" : "ts"), 
{
    token: process.env.DISCORD_TOKEN
});

manager.on('shardCreate', shard => console.log(`${chalk.magenta('[Shard]')} Shard ${chalk.magentaBright(`#${shard.id}`)} is starting.`));

async function managerSpawn(): Promise<void> {
    await commandRegister((process.env.DISCORD_TOKEN as string));
    await manager.spawn();
}

managerSpawn()