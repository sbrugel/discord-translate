import DiscordJS, { ApplicationCommand, Client, Collection, CommandInteraction, ContextMenuInteraction, Guild, Intents } from 'discord.js'
import { Action } from './interfaces/Action';
import { readdirRecursive } from './utils/readdirRecursive';
import { BOT } from './config';

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

        console.log(cmdData);

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
    if (interaction.isCommand()) runCommand(interaction, client);
    if (interaction.isContextMenu()) runContextMenuInteraction(interaction, client);
})

async function runCommand(interaction: CommandInteraction, client: Client): Promise<unknown> {
    const command = client.commands.get(interaction.commandName);

    if (command.run !== undefined) {
        try {
            command.run(interaction);
        } catch (error) {
            console.log(error);
        }
    }

    return;
}

async function runContextMenuInteraction(interaction: ContextMenuInteraction, client: Client): Promise<unknown> {
    const command = client.commands.get(interaction.commandName);

    if (command.run !== undefined) {
        try {
            command.run(interaction);
        } catch (error) {
            console.log(error);
        }
    }

    return;
}