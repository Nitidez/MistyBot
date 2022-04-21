import chalk from 'chalk';
import { Client } from 'discord.js';


export async function run(client: Client): Promise<void> {
    console.log(`${chalk.magenta('[Shard]')} Shard ${chalk.magentaBright('#' + client.shard?.ids[0])} started.`)
}