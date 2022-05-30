import { ApplicationCommandOptionData, ApplicationCommandPermissionData, ApplicationCommandType, CommandInteraction, Interaction, Message } from "discord.js";

export abstract class Action {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    type: ApplicationCommandType;

    abstract run?(interaction: CommandInteraction): Promise<void>;
}