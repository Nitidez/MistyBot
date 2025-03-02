import config from "@/json/config";
import MistyClient from "@/lib/MistyClient";
import {CmdInteraction, getCommand, getCommands} from "@/lib/Command";
import { Message } from "discord.js";

export default async function messageCreate(client: MistyClient, message: Message<boolean>) {
    if (!message.author.bot) {
        const split = message.content.split(" ");
        if (split[0].toLowerCase().startsWith(config.prefix)) {
            const noPrefixCmd = split[0].substring(config.prefix.length).toLowerCase()
            if (getCommand(noPrefixCmd)) {
                let args = split;
                args.shift();
                getCommand(noPrefixCmd)!.run(new CmdInteraction(
                    message.applicationId,
                    message.author,
                    message.channel,
                    message.channelId,
                    client,
                    message.content,
                    args,
                    message.createdAt,
                    message.createdTimestamp,
                    message.guild,
                    message.guildId,
                    message.id,
                    message.member,
                    message,
                    null
                ))
            }
        }
    }
}