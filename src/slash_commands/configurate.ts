import { 
    CommandInteraction, 
    ButtonInteraction, 
    ModalSubmitInteraction, 
    SelectMenuInteraction, 
    ContextMenuCommandInteraction,
    Locale,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import path from 'path';
import { PermissionType } from '../components/enums';
import { commandsLanguage as cl } from '../components/language'

const flname = path.basename(__filename, path.extname(__filename));
const commandsLanguage = cl.find(c => c.name == flname)

function localizate(locale: Locale, valueId: string) {return commandsLanguage?.localizations.find(l => l.id == valueId)?.value[locale]}
function commandId(id: string): string {return `command;${flname};${id}`}
function run(interaction: CommandInteraction | ContextMenuCommandInteraction): void {
    const locale = interaction.locale
    interaction.reply({content: 'Example content. ' + interaction.guild?.preferredLocale})
}

export async function execute(interaction: CommandInteraction): Promise<void> {
    run(interaction);
}

export async function buttonResponse(interaction: ButtonInteraction, buttonId: string): Promise<void> {}

export async function modalResponse(interaction: ModalSubmitInteraction, modalId: string): Promise<void> {}
export async function selectMenuResponse(interaction: SelectMenuInteraction, selectMenuId: string): Promise<void> {}
export async function contextMenuResponse(interaction: ContextMenuCommandInteraction, contextMenuId: string): Promise<void> {}

const info = {
    type: 'default',
    permissions: [
    {
        id: undefined,
        type: PermissionType.MistyGuildOwner,
        permission: true
    }
    ],
    slash: new SlashCommandBuilder()
    .setName(flname)
    .setNameLocalizations(commandsLanguage ? commandsLanguage.nameLocalizations : {})
    .setDescription('Bot configuration command.')
    .setDescriptionLocalizations(commandsLanguage ? commandsLanguage.descriptionLocalizations : {})
    .setDefaultPermission(false)
}

export {info};