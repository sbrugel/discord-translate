import { ApplicationCommandType, MessageContextMenuInteraction } from "discord.js";
import { Action } from "../interfaces/Action";
import translate from '@vitalets/google-translate-api';

export default class extends Action {
    name = 'translate'
    type: ApplicationCommandType = "MESSAGE"
    async run(interaction: MessageContextMenuInteraction): Promise<void> {
        const input = interaction.targetMessage.content;
        const res = await translate(input, {to: 'de'});
        return interaction.reply(res.text);
    }
}