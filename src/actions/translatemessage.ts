import { ApplicationCommand, ApplicationCommandType, CommandInteraction } from "discord.js";
import { Action } from "../interfaces/Action";

export default class extends Action {
    name = 'translate'
    type: ApplicationCommandType = "MESSAGE"
    async run(interaction: CommandInteraction): Promise<void> {
        return interaction.reply("Placeholder");
    }
}