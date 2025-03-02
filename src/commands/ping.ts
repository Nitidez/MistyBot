import { CmdInteraction, Command } from "@/lib/Command"
import { Emojis } from "@/lib/Emojis";
import { SlashCommandBuilder } from "discord.js"

const command: Command = new Command("ping",
new SlashCommandBuilder()
.setDescription("Bot ping."),
async (interaction: CmdInteraction) => {
    interaction.reply(`Teste ${Emojis.brokenurl}`);
});
export default command;