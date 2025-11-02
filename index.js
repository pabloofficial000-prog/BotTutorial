const { Client, Collection, GatewayIntentBits, Events, ActivityType } = require("discord.js"); // Se añade ActivityType
const { loadSlash, registerSlash } = require("./handlers/slashHandler");
const { loadEvents } = require("./handlers/eventHandler");

// ASUMO que tienes un archivo config.json donde guardas tu token.
// Si no existe, debes crearlo.
// const { TOKEN } = require("./config.json"); 

// El código original tenía el token quemado aquí, lo reemplazo para que lo uses con una variable.
// 🚨 REEMPLAZA ESTO con tu Token real o cárgalo desde un archivo de configuración (config.json)
const TOKEN = "MTQzNDU5NjM4MTgzMzY5MTIyNg.GjtU1A.rbouofF7wGgyyYFbgAIQDdNoosIop6JQbRHObU"; 

// Use the necessary intents for command handling
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,       // For guild-related events and fetching guild information
        GatewayIntentBits.GuildMessages, // For messages/interactions within guilds
        GatewayIntentBits.MessageContent // Necessary if you need to read message content (though not for slash commands)
    ] 
});

// Storage
client.slashCommands = new Collection();
let slashCommandsArray = []; 

// --- INTERACTION HANDLER ---
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return; 

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;

    try {
        await cmd.execute(interaction); 
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);

        const errorContent = 'There was an error while executing this command!';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorContent, ephemeral: true }).catch(() => null);
        } else {
            await interaction.reply({ content: errorContent, ephemeral: true }).catch(() => null);
        }
    }
});


// --- READY EVENT and Command Loading ---
client.on(Events.ClientReady, async () => {
    // 1. Load commands
    if (slashCommandsArray.length === 0) {
        try {
            slashCommandsArray = await loadSlash(client);
            console.log("Slash Commands loaded internally successfully.");
        } catch (err) {
            console.error(`❎ Error loading commands internally: ${err}`);
            return;
        }
    }
    
    // 2. Register commands
    await registerSlash(client, slashCommandsArray); 

    // 🌟 ESTABLECER ESTADO PERSONALIZADO 🌟
    client.user.setPresence({
        activities: [{
            name: `Ve a Pablox Tutorials!`, // El texto del estado (Ej: Moderating...)
            type: ActivityType.Custom // El tipo de actividad es CUSTOM
        }],
        status: 'online', // El estado visible (online, idle, dnd, invisible)
    });
    // 🌟 FIN DEL ESTADO PERSONALIZADO 🌟

    console.log(`✅ Bot online as: ${client.user.tag}`);
});


// --- INITIALIZATION ---

// Cargar todos los archivos de eventos
loadEvents(client);

(async () => {
    // Usamos la variable TOKEN definida arriba
    await client
        .login(TOKEN)
        .catch((err) =>
            console.error(`❎ Error logging in: ${err}`)
        );
})();