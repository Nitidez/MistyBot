import { CommandInteraction, Guild, GuildBasedChannel, GuildMember, InteractionReplyOptions, InteractionResponse, Message, MessagePayload, SlashCommandBuilder, Snowflake, TextBasedChannel, User } from "discord.js";
import MistyClient from "./MistyClient";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let commands = new Map<string, Command>();

class CmdInteraction {
    public readonly applicationId: Snowflake | null;
    public readonly user: User;
    public readonly channel: GuildBasedChannel | TextBasedChannel | null;
    public readonly channelId: Snowflake;
    public readonly client: MistyClient;
    public readonly content: string;
    public readonly args: string[];
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public readonly guild: Guild | null;
    public readonly guildId: Snowflake | null;
    public readonly id: Snowflake;
    public readonly member: GuildMember | null;
    public readonly message: Message | null;
    public readonly commandInteraction: CommandInteraction | null;

    public constructor(
        applicationId: Snowflake | null,
        user: User,
        channel: GuildBasedChannel | TextBasedChannel | null,
        channelId: Snowflake,
        client: MistyClient,
        content: string,
        args: string[],
        createdAt: Date,
        createdTimestamp: number,
        guild: Guild | null,
        guildId: Snowflake | null,
        id: Snowflake,
        member: GuildMember | null,
        message: Message | null,
        commandInteraction: CommandInteraction | null
        ) {
            this.applicationId = applicationId,
            this.user = user,
            this.channel = channel,
            this.channelId = channelId,
            this.client = client,
            this.content = content,
            this.args = args,
            this.createdAt = createdAt,
            this.createdTimestamp = createdTimestamp,
            this.guild = guild,
            this.guildId = guildId,
            this.id = id,
            this.member = member,
            this.message = message,
            this.commandInteraction = commandInteraction
        }

        public async reply(options: string | MessagePayload | InteractionReplyOptions) : Promise<Message<boolean> | InteractionResponse<boolean> | undefined> {
            if (this.message) {
                return this.message.reply(options as string | MessagePayload);
            } else if (this.commandInteraction) {
                return this.commandInteraction.reply(options);
            }
        }
}

class Command {
    private name: string;
    private aliases: string[] | undefined;
    private slash: SlashCommandBuilder;
    private runFunction: (interaction: CmdInteraction) => void;
    private autoComplete?: void;

    public constructor(name: string, slash: SlashCommandBuilder, runFunction: (interaction: CmdInteraction) => void, ...aliases: string[]) {
        this.name = name;
        this.slash = slash;
        this.runFunction = runFunction;
        this.aliases = aliases;
        commands.set(name, this)
    }

    public getName(): string {
        return this.name;
    }

    public getAliases(): string[]|undefined {
        return this.aliases;
    }

    public getSlash(): SlashCommandBuilder {
        return this.slash;
    }

    public run(interaction: CmdInteraction): void {
        return this.runFunction(interaction);
    }


}

function getCommands() : Map<string, Command> {
    return commands;
}

function getCommand(name: string): Command|undefined {
    if (commands.has(name)) {
        return commands.get(name);
    } else if (findCommandByAlias(name)) {
        return findCommandByAlias(name);
    }
}

function findCommandByAlias(alias: string): Command|undefined {
    const command = Array.from(commands.values()).find(command => command.getAliases()?.includes(alias));
    return command;
}

async function registerCommands() : Promise<void> {
    const directoryPath = path.join(__dirname, "../commands")
    const files = await fs.promises.readdir(directoryPath);
    const importPromise = files.map(async file => {
        const filePath = path.join(directoryPath, file);
        await import(filePath)
    });
    await Promise.all(importPromise);
}

export {Command, CmdInteraction, getCommands, registerCommands, getCommand}