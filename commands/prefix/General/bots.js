const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "botayar",
    description: "Bot ayar menüsü",
    permissions: ["SendMessages"]
  },

  
  run: async (client, message, args, prefix) => {

    const sunucu = message.guild;
    const sunucuSahibi = sunucu.owner;

    const botSahibiID = "1185163404609073173"; // Bot sahibinin Discord kullanıcı ID'sini buraya yazın
    const botSahibi = await client.users.fetch(botSahibiID);

    const sunucuKurulusTarihi = sunucu.createdAt.toLocaleDateString("tr-TR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });


    // Select menu options
    const options = [
      { label: 'Botun pp değiştir', value: 'change_pp' },
      { label: 'Botun ismi değiştir', value: 'change_name' },
      { label: 'Botun hakkında kısmını değiştir', value: 'change_description' },
    ];

    // Create select menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('</> Bir seçenek seçin')
      .addOptions(options);

    // Create action row with select menu button
    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    // Create "Tüm botları yeniden başlat" button
    const yesButton = new ButtonBuilder()
      .setStyle('Danger')
      .setLabel('Tum botları yeniden başlat')
      .setEmoji('1208112355922411520')
      .setCustomId('restart_all_bots');

    // Create action row with "Tüm botları yeniden başlat" button
    const actionRowWithButton = new ActionRowBuilder().addComponents(yesButton);

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle('<a:galp:1208471127295533057> Bot ayar menüsüne hoşgeldin ')
      .setDescription(`Lütfen bir seçenek seçin.\n\n<:6815turquoiseownerbadge:1214232768658149448> **Sunucu Sahibi:** \`${sunucuSahibi}\`\n<:4323blurpleverifiedbotdeveloper:1212755012636385280> **Bot Sahibi:** ${botSahibi}\n<:Book:1208471153803395153> **Sunucu Kuruluş Tarihi:** \`${sunucuKurulusTarihi}\``);

    // Send message with select menu and "Tüm botları yeniden başlat" button
    const messageReference = await message.reply({ embeds: [embed], components: [actionRow, actionRowWithButton], fetchReply: true });

    // Create filter for collector
    const filter = interaction => interaction.isSelectMenu() && interaction.customId === 'select';

    // Create collector
    const collector = messageReference.createMessageComponentCollector({ filter, time: 15000 });

    // Handle selection
    collector.on('collect', async interaction => {
      const selectedValue = interaction.values[0];
      switch (selectedValue) {
        case 'change_pp':
          // Logic to change bot's profile picture
          interaction.reply({ content: 'Botun profil fotoğrafını değiştirmek için bir fotoğrafı etiketleyin.', ephemeral: true });
          const profileFilter = response => response.author.id === message.author.id && response.attachments.size > 0;
          const profileCollector = message.channel.createMessageCollector({ filter: profileFilter, max: 1, time: 30000 }); // 30 seconds
          profileCollector.on('collect', async response => {
            const attachment = response.attachments.first();
            const imageURL = attachment.url;
            try {
              await client.user.setAvatar(imageURL);
              interaction.followUp({ content: '<a:kirmiziok:1208471148384354334> Botun profil fotoğrafı başarıyla değiştirildi!', ephemeral: true });
            } catch (error) {
              console.error(error);
              interaction.followUp({ content: 'Botun profil fotoğrafını değiştirirken bir hata oluştu.', ephemeral: true });
            }
          });
          break;
        case 'change_name':
          // Logic to change bot's name
          interaction.reply({ content: 'Botun yeni ismini yazın.', ephemeral: true });
          const nameFilter = response => response.author.id === message.author.id;
          const nameCollector = message.channel.createMessageCollector({ filter: nameFilter, max: 1, time: 30000 }); // 30 seconds
          nameCollector.on('collect', async response => {
            const newName = response.content;
            try {
              await client.user.setUsername(newName);
              interaction.followUp({ content: 'Botun ismi başarıyla değiştirildi!', ephemeral: true });
            } catch (error) {
              console.error(error);
              interaction.followUp({ content: 'Botun ismini değiştirirken bir hata oluştu.', ephemeral: true });
            }
          });
          break;
        case 'change_description':
          // Logic to change bot's description
          interaction.reply({ content: 'Lütfen yeni bot açıklamasını yazın:', ephemeral: true });
          const descriptionFilter = response => response.author.id === message.author.id;
          const descriptionCollector = message.channel.createMessageCollector({ filter: descriptionFilter, max: 1, time: 60000 }); // 60 seconds
          descriptionCollector.on('collect', async response => {
            const newDescription = response.content;
            try {
              await client.user.setActivity(newDescription);
              interaction.followUp({ content: '<a:kirmiziok:1208471148384354334> Botun hakkında kısmı başarıyla değiştirildi!', ephemeral: true });
            } catch (error) {
              console.error(error);
              interaction.followUp({ content: 'Botun hakkında kısmını değiştirirken bir hata oluştu.', ephemeral: true });
            }
          });
          break;
        default:
          interaction.followUp({ content: 'Geçersiz seçenek!', ephemeral: true });
      }
    });

    // Handle collector end
    collector.on('end', () => {
      messageReference.edit({ components: [] }); // Remove action row after collector ends
    });
  }
};
