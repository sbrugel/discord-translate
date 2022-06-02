import { ApplicationCommandOptionData, ApplicationCommandType, CommandInteraction, MessageEmbed } from "discord.js";
import { Action } from "../interfaces/Action";
import translate from '@vitalets/google-translate-api';
import { getFullLang } from "../utils/getFullLang";

export default class extends Action {
    name = 'translate'
    description = 'Translate a string'
    options: ApplicationCommandOptionData[] = [
        {
            name: 'input',
            description: 'What to translate',
            type: 'STRING',
            required: true
        },
        {
            name: 'languageto',
            description: 'The language to translate into',
            type: 'STRING',
            required: true
        },
        {
            name: 'languagefrom',
            description: 'The language to translate from',
            type: 'STRING',
            required: false
        },
    ]
    type: ApplicationCommandType = "CHAT_INPUT"
    async run(interaction: CommandInteraction): Promise<void> {
        const input = interaction.options.getString('input')!;
        const translateTo = interaction.options.getString('languageto')!, translateFrom = interaction.options.getString('languagefrom');
        let res;

        try {
            res = await translate(input, (translateFrom ? {from: translateFrom, to: translateTo} : {to: translateTo}));
        } catch (error) {
            return interaction.reply('Sorry, an error occured: ' + error);
        }
        
        const responseEmbed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(res.text);

        responseEmbed.setFooter({ text: (translateFrom ? `Translated '${input}' from ${translateFrom} to ${translateTo}.` : `Translated '${input}' into ${translateTo}. The detected input language was ${getFullLang(res.from.language.iso)}`) });
        return interaction.reply({ embeds: [responseEmbed] });
    }
}