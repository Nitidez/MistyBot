import { REST } from "@discordjs/rest";
import chalk from "chalk";
import { RESTGetAPICurrentUserGuildsResult, RESTGetAPIGuildResult, RESTGetAPIOAuth2CurrentApplicationResult, RESTPostAPIApplicationCommandsJSONBody, RESTPutAPIApplicationGuildCommandsJSONBody, RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, Routes } from "discord-api-types/v10";
import { SlashCommandBuilder } from "discord.js";
import fs from 'node:fs';

interface commandPermissions {id: string, type: string, permission: boolean}
export default async function(token: string) {
    const rest = new REST({version: '10'}).setToken(token)
    const directory = (`./${process.env.NODE_ENV === 
        'production' ? 'dist' : 'src'}/slash_commands`)
    const client = await rest.get(Routes.oauth2CurrentApplication()) as RESTGetAPIOAuth2CurrentApplicationResult
    const guilds = await rest.get(Routes.userGuilds()) as RESTGetAPICurrentUserGuildsResult
    
    let raw_commands: Array<{
        type: string,
        permissions: Array<commandPermissions>
        slash: SlashCommandBuilder
    }> = []
    
    for (const file of fs.readdirSync(directory).filter((file: string) => file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'))) {
        const c: {
            type: string,
            permissions: Array<commandPermissions>
            slash: SlashCommandBuilder
        } = (await import(`../slash_commands/${file}`)).info
        console.log(`${chalk.cyan('[Command]')} Command \'${chalk.cyanBright(c.slash.name)}\' saved.`)
        raw_commands.push(c)
    }

    let workedGuilds = 0
    guilds.forEach(async (g, index, array) => {
        const guild = await rest.get(Routes.guild(g.id)) as RESTGetAPIGuildResult
        let slashGuildCommands: Array<RESTPostAPIApplicationCommandsJSONBody> = []
        
        // Global Guild-Only Command Adder
        raw_commands.filter(c => c.type == 'default').forEach(c => {
            slashGuildCommands.push(c.slash.toJSON())
        })
        //

        const guildCommands = await rest.put(Routes.applicationGuildCommands(client.id, guild.id), {body: slashGuildCommands}) as RESTPutAPIApplicationGuildCommandsJSONBody
        
        // Command Permission Handler
        const permissions: Array<{id: string, permissions: Array<commandPermissions>}> = []
        const permSlash = raw_commands.filter(c => 
            c.type !== 'global' &&
            slashGuildCommands.find(cc => cc.name == c.slash.name) &&
            c.permissions != undefined
        )
        const permGuildCommands = guildCommands.filter(c => permSlash.find(cc => cc.slash.name == c.name))
        permGuildCommands.forEach(async (guildCommand) => {
            const slashGuildCommand = permSlash.find(c => c.slash.name == guildCommand.name)
            const commandPermission: Array<commandPermissions> = []
        
            // Permission Verifiers
            const permissionsAdd: Array<commandPermissions> = slashGuildCommand ? slashGuildCommand.permissions : []
            const permGuildOwnerOnly = permissionsAdd.filter(p => p.type == '3')

            commandPermission.push(...permissionsAdd.filter(p => parseInt(p.type) < 3))
            if (permGuildOwnerOnly) commandPermission.push({id: guild.owner_id, type: '2', permission: permGuildOwnerOnly[0].permission })
            //

            permissions.push({id: (guildCommand as any).id as string, permissions: commandPermission})
        })

        await rest.put(Routes.guildApplicationCommandsPermissions(client.id, guild.id), {body: permissions}) as RESTPutAPIGuildApplicationCommandsPermissionsJSONBody
        //

        workedGuilds++
        if (workedGuilds === array.length) {
            console.log(`${chalk.cyan('[Command]')} ${chalk.cyanBright('Guild-Only')} commands registered.`)
        }
    })

}