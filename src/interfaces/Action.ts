import { ApplicationCommandOptionData, ApplicationCommandType, CommandInteraction, MessageContextMenuInteraction } from "discord.js";

export abstract class Action {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    type: ApplicationCommandType;

    abstract run?(interaction: CommandInteraction | MessageContextMenuInteraction): Promise<void>;
}