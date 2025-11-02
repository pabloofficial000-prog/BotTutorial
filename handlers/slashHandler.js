// handlers/slashHandler.js
const fs = require('fs').promises;
const path = require('path');
// ... otras dependencias si las hay

async function loadSlash(client) {
    const commandsArray = [];
    const commandFolders = await fs.readdir(path.join(__dirname, '..', 'slashcommands', 'comandos'));

    for (const folder of commandFolders) {
        const commandFiles = await fs.readdir(path.join(__dirname, '..', 'slashcommands', 'comandos', folder));
        for (const file of commandFiles) {
            if (file.endsWith('.js')) {
                const command = require(path.join(__dirname, '..', 'slashcommands', 'comandos', folder, file));
                if ('data' in command && 'execute' in command) {
                    client.slashCommands.set(command.data.name, command);
                    commandsArray.push(command.data.toJSON());
                } else {
                    console.warn(`[WARNING] El comando en ${file} no tiene propiedades "data" o "execute" requeridas.`);
                }
            }
        }
    }
    // Retornamos el array JSON de comandos para el registro
    return commandsArray; 
}

// Función para registrar los comandos globalmente
async function registerSlash(client, commandsArray) {
    if (!client.application?.commands) {
        // Esperamos a que el bot tenga el objeto de aplicación disponible
        await client.application.fetch();
    }
    
    // 🚨 Esta línea sobrescribe todos los comandos, forzando la actualización en Discord.
    // Esto es CLAVE para arreglar problemas de caching.
    await client.application.commands.set(commandsArray); 
    console.log(`[Registro] Se registraron ${commandsArray.length} comandos globalmente.`);
}

module.exports = { loadSlash, registerSlash };