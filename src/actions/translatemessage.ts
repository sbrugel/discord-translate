import { ApplicationCommandType, Message, MessageActionRow, MessageContextMenuInteraction, MessageEmbed, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import { Action } from "../interfaces/Action";
import translate from '@vitalets/google-translate-api';
import { getFullLang } from "../utils/getFullLang";

export default class extends Action {
    name = 'translate'
    type: ApplicationCommandType = "MESSAGE"
    async run(interaction: MessageContextMenuInteraction): Promise<void> {
        if (!interaction.targetMessage.content) return interaction.reply('Sorry, I can\'t translate this message.');

        const input = interaction.targetMessage.content;

        let modal = new Modal()
            .setTitle('Translate message')
            .setCustomId('translatemessage')
        
        const translateToComponent = new TextInputComponent()
            .setCustomId('translateTo')
            .setLabel('Language to translate this message to')
            .setStyle("SHORT")
            .setRequired(true)

        const translateFromComponent = new TextInputComponent()
            .setCustomId('translateFrom')
            .setLabel('Language to translate this message from')
            .setStyle("SHORT")
            .setRequired(false)   
            .setPlaceholder('If not filled, will be auto detected')

        const translateMsgComponent = new TextInputComponent()
            .setCustomId('translateMsg')
            .setLabel('This is the message you are translating')
            .setStyle("SHORT")
            .setRequired(true)
            .setValue(interaction.targetMessage.content);

        const modalRows: MessageActionRow<ModalActionRowComponent>[] = [
            new MessageActionRow<ModalActionRowComponent>().addComponents(translateToComponent),
            new MessageActionRow<ModalActionRowComponent>().addComponents(translateFromComponent),
            new MessageActionRow<ModalActionRowComponent>().addComponents(translateMsgComponent)
        ];
        modal.addComponents(...modalRows);
        
        await interaction.showModal(modal);
        const translateTo = 'de', translateFrom = null;

        const res = await translate(input, (translateFrom ? {from: translateFrom, to: translateTo} : {to: translateTo}));
        const responseEmbed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(res.text);

        responseEmbed.setFooter({ text: (translateFrom ? `Translated '${input}' from ${translateFrom} to ${translateTo}.` : `Translated '${input}' into ${translateTo}. The detected input language was ${getFullLang(res.from.language.iso)}`) });
    }
}