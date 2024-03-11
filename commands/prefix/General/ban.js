const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
      name: "ban",
      description: "Yalnızca kayıtlı sahiplerle yanıt verir.",
    },
    permissions: ["BanMembers"],
    run: async (client, message, args, prefix, config) => {
  
      const userToBan = message.mentions.members.first(); // Assuming you're banning a mentioned user
      if (!userToBan) return message.reply("Bir kullanıcı belirtmelisiniz!");
  
      const confirmationEmbed = new EmbedBuilder()
        .setDescription(`**${userToBan.user.tag}** adlı kullanıcıyı banlamak istiyor musunuz?`)
        .setColor(0x2B2D31);
  
      const yesButton = new ButtonBuilder()
        .setStyle('Danger')
        .setLabel('Evet')
        .setCustomId('yes_button');
  
      const noButton = new ButtonBuilder()
        .setStyle('Success')
        .setLabel('Hayır')
        .setCustomId('no_button');
  
      const actionRow = new ActionRowBuilder()
        .addComponents(yesButton, noButton);
  
      const confirmationMessage = await message.reply({
        embeds: [confirmationEmbed],
        components: [actionRow]
      });
  
      const filter = interaction => ['yes_button', 'no_button'].includes(interaction.customId) && interaction.user.id === message.author.id;
  
      const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 }); // 15 seconds
  
      collector.on('collect', async interaction => {
        if (interaction.customId === 'yes_button') {
          await userToBan.ban({ reason: 'Kuralları ihlal etmekten dolayı.' });
          interaction.reply({ content: `${userToBan.user.tag} başarıyla yasaklandı!`, ephemeral: true });
        } else if (interaction.customId === 'no_button') {
          confirmationMessage.delete();
          interaction.reply({ content: 'İşlem iptal edildi.', ephemeral: true });
        }
      });
  
      collector.on('end', () => {
        confirmationMessage.edit({ components: [] });
      });
    },
  };