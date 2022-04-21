import { ButtonInteraction, CommandInteraction, Interaction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import fs from 'node:fs'
const slashdirectory = './' + (process.env.NODE_ENV === 'production' ? 'dist' : 'src') + '/slash_commands';

async function findCommand(commandName: string) {
    const dirsync = fs.readdirSync(slashdirectory).filter(f => f.endsWith(`.${process.env.NODE_ENV === 'production' ? '.js' : 'ts'}`))
    if (!dirsync) return false;
    const cmd = dirsync.find(f => f.split('.')[0] === commandName);
    if (!cmd) return false;
    const command = await import(`../slash_commands/${cmd}`)
    return command;
}

async function modalSubmitInteraction(interaction: ModalSubmitInteraction): Promise<void> {
    const sections = interaction.customId.split(';');
    if (interaction.customId.startsWith('command;')) {
        if (!(await findCommand(sections[1]))) return;
        (await findCommand(sections[1])).modalResponse(interaction, sections[2])
    }
}
async function selectMenuInteraction(interaction: SelectMenuInteraction): Promise<void> {
    const sections = interaction.customId.split(';');
    if (interaction.customId.startsWith('command;')) {
        if (!(await findCommand(sections[1]))) return;
        (await findCommand(sections[1])).selectMenuResponse(interaction, sections[2])
    }
}
async function buttonInteraction(interaction: ButtonInteraction): Promise<void> {
    const sections = interaction.customId.split(';')
    if (interaction.customId.startsWith('command;')) {
        if (!(await findCommand(sections[1]))) return;
        (await findCommand(sections[1])).buttonResponse(interaction, sections[2])
    }
}
async function commandInteraction(interaction: CommandInteraction): Promise<void> {
    (await findCommand(interaction.commandName)).execute(interaction)
}
export async function run(interaction: Interaction): Promise<void> {
    if (interaction.isCommand()) commandInteraction(interaction);
    if (interaction.isButton()) buttonInteraction(interaction);
    if (interaction.isModalSubmit()) modalSubmitInteraction(interaction);
    if (interaction.isSelectMenu()) selectMenuInteraction(interaction)
}