const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Permissions } = require("discord.js");

module.exports = {
  config: {
    name: "sunucu",
    description: "Sunucu profilini ve ismini değiştirme seçenekleri.",
  },
  permissions: ['ManageGuild'],
  owner: false,
  run: async (client, message, args, prefix, config) => {

    // Create buttons for changing server profile picture and name
    const changeProfileButton = new ButtonBuilder()
      .setStyle('Primary')
      .setLabel('Sunucu Profilini Değiştir')
      .setEmoji('1214232777759924294')
      .setCustomId('change_profile_button');

    const changeNameButton = new ButtonBuilder()
      .setStyle('Primary')
      .setLabel('Sunucu İsmini Değiştir')
      .setEmoji('1214232768658149448')
      .setCustomId('change_name_button');

    // Create action row with the buttons
    const actionRow = new ActionRowBuilder()
      .addComponents(changeProfileButton, changeNameButton);

    // Create an embed to provide information
    const embed = new EmbedBuilder()
      .setDescription('<a:kirmiziok:1208471148384354334> Sunucu profilini ve ismini değiştirmek için aşağıdaki seçenekleri kullanabilirsiniz.')
      .setColor(0x2B2D31)

    // Reply with the embed and action row
    const replyMessage = await message.reply({
      embeds: [embed],
      components: [actionRow]
    });

    // Create a filter to listen for button interactions from the original author
    const filter = interaction => ['change_profile_button', 'change_name_button'].includes(interaction.customId) && interaction.user.id === message.author.id;

    // Create a collector to handle button interactions
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 }); // 15 seconds

    collector.on('collect', async interaction => {
      // Defer the interaction to indicate that the bot has received the interaction
      interaction.deferUpdate();

      // Handle interaction based on the custom ID of the button
      if (interaction.customId === 'change_profile_button') {
        // Prompt the user to upload an image
        message.channel.send('<a:kirmiziok:1208471148384354334> Sunucu profil fotoğrafını değiştirmek için bir fotoğrafı etiketleyin.');

        const profileFilter = response => response.author.id === message.author.id && response.attachments.size > 0;

        const profileCollector = message.channel.createMessageCollector({ filter: profileFilter, max: 1, time: 30000 }); // 30 seconds

        profileCollector.on('collect', async response => {
          const attachment = response.attachments.first();
          const imageURL = attachment.url;

          // Logic to change server profile picture
          try {
            await message.guild.setIcon(imageURL);
            interaction.editReply({ content: 'Sunucu profil fotoğrafı başarıyla değiştirildi!', ephemeral: true });
          } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Sunucu profil fotoğrafını değiştirirken bir hata oluştu.', ephemeral: true });
          }
        });

        profileCollector.on('end', collected => {
          if (collected.size === 0) {
            message.channel.send('Zaman aşımı! Sunucu profil fotoğrafını değiştirmek için bir fotoğrafı etiketlemelisiniz.');
          }
        });
      } else if (interaction.customId === 'change_name_button') {
        // Prompt the user to enter a new server name
        message.channel.send('<a:kirmiziok:1208471148384354334> Sunucu ismini değiştirmek için yeni bir isim yazın.');

        const nameFilter = response => response.author.id === message.author.id;

        const nameCollector = message.channel.createMessageCollector({ filter: nameFilter, max: 1, time: 30000 }); // 30 seconds

        nameCollector.on('collect', async response => {
          const newName = response.content;

          // Logic to change server name
          try {
            await message.guild.setName(newName);
            interaction.editReply({ content: 'Sunucu ismi başarıyla değiştirildi!', ephemeral: true });
          } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Sunucu ismini değiştirirken bir hata oluştu.', ephemeral: true });
          }
        });

        nameCollector.on('end', collected => {
          if (collected.size === 0) {
            message.channel.send('Zaman aşımı! Sunucu ismini değiştirmek için yeni bir isim yazmalısınız.');
          }
        });
      }
    });

    // Handle collector end
    collector.on('end', () => {
      replyMessage.edit({ components: [] }); // Remove action row after collector ends
    });
  },
};