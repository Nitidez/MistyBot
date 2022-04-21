import { LocalizationMap } from 'discord-api-types/v10'

interface commandsInterface {
    name: string
    nameLocalizations: LocalizationMap,
    descriptionLocalizations: LocalizationMap
    localizations: Array<{
        id: string
        value: LocalizationMap
    }>
}
const commandsLanguage: Array<commandsInterface> = [
    {
        name: 'configurate',
        nameLocalizations: {
            "pt-BR": 'configurar'
        },
        descriptionLocalizations: {
            "pt-BR": 'Comando de configuração do bot.',
        },
        localizations: [
            {
                id: 'sus',
                value: {
                    "pt-BR": 'a',
                    "en-US": 'b'
                }
            }
        ]
    }
]

export {commandsLanguage}