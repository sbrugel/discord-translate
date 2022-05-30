import { ApplicationCommandType, CommandInteraction } from "discord.js";
import { Action } from "../interfaces/Action";

export default class extends Action {
    name = 'translate'
    description = 'Translate a string'
    type: ApplicationCommandType = "CHAT_INPUT"
    async run(interaction: CommandInteraction): Promise<void> {
        return interaction.reply("Placeholder");
    }
}