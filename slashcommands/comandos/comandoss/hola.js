// hola.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Definición del comando de barra (Slash Command)
    // Se usa SlashCommandBuilder para construir los datos del comando.
	data: new SlashCommandBuilder()
		.setName('hola')
		.setDescription('Saluda y proporciona un enlace para suscribirse.'),

    // Función de ejecución del comando
	async execute(interaction) {
        // El mensaje de respuesta que quieres enviar
        const respuesta = "¡Hola, **suscribete**! y no olvides visitar mi canal: https://youtube.com/@pabloxtutorials";
        
        // El método reply/send_message se convierte en 'reply' o 'send' o 'editReply'
        // En discord.js v13/v14, usamos interaction.reply() para enviar la respuesta inicial.
		await interaction.reply({ 
            content: respuesta, 
            ephemeral: false // false significa que todos lo ven. Usa true si solo el usuario lo debe ver.
        });
	},
};