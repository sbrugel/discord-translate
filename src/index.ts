import DiscordJS, { ApplicationCommand, Client, Collection, CommandInteraction, MessageContextMenuInteraction, Guild, Intents, MessageEmbed } from 'discord.js'
import { Action } from './interfaces/Action';
import { readdirRecursive } from './utils/readdirRecursive';
import { BOT } from './config';
import translate from '@vitalets/google-translate-api';
import { getFullLang } from './utils/getFullLang';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.login(BOT.TOKEN);

client.on('ready', async () => {
    // load actions (commands, context menu options...)
    console.log("Loading actions...");
    client.commands = new Collection();
    const { commands } = client.guilds.cache.get('679777315814637683') as Guild;
    const commandFiles = readdirRecursive(`${__dirname}/actions`).filter(file => file.endsWith('.js'));
    const awaitedCommands: Promise<ApplicationCommand>[] = [];

    for (const file of commandFiles) {
        const commandModule = await import(file);

        const dirs = file.split('/');
		const name = dirs[dirs.length - 1].split('.')[0];

        if (!(typeof commandModule.default === 'function')) {
			console.log(`Invalid command ${name}`);
			continue;
		}

        const command: Action = new commandModule.default;

        command.name = name;

        const guildCmd = commands.cache.find(cmd => cmd.name === command.name);

        const cmdData = {
            name: command.name,
            description: command.description,
            options: command?.options || [],
            type: command.type,
            defaultPermission: true // allow commands to be used by anyone
        }

        if (!guildCmd) {
            awaitedCommands.push(commands.create(cmdData));
        } else {
            awaitedCommands.push(commands.edit(guildCmd.id, cmdData));
        }
        
        client.commands.set(name, command);
    }

    // done with everything now!
    console.log('Ready!');
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() || interaction.isMessageContextMenu()) runCommand(interaction, client);
    if (interaction.isModalSubmit()) {
        const { customId, fields } = interaction;
        if (customId === 'translatemessage') {
            const input = fields.getTextInputValue('translateMsg'), 
            translateTo = fields.getTextInputValue('translateTo'), 
            translateFrom = fields.getTextInputValue('translateFrom') || '';

            let res;
            try {
                res = await translate(input, (translateFrom ? {from: translateFrom, to: translateTo} : {to: translateTo}));
            } catch (error) {
                interaction.reply('Sorry, an error occured: ' + error);
                return;
            }
            const responseEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(res.text);

            responseEmbed.setFooter({ text: (translateFrom ? `Translated '${input}' from ${translateFrom} to ${translateTo}.` : `Translated '${input}' into ${translateTo}. The detected input language was ${getFullLang(res.from.language.iso)}`) });
            interaction.reply({ embeds: [responseEmbed] });
        }
    }
})

async function runCommand(interaction: CommandInteraction | MessageContextMenuInteraction, client: Client): Promise<unknown> {
    const command = client.commands.get(interaction.commandName);

    if (command.run !== undefined) {
        try {
            command.run(interaction);
        } catch (error) {
            return interaction.reply('Sorry, an error occured. ' + error);
        }
    }

    return;
}