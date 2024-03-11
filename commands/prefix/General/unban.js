const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "unban",
    description: "Belirtilen kullanıcının yasağını kaldırır.",
    permissions: ["BanMembers"]
  },
  run: async (client, message, args, prefix) => {
    // Check if the user has mentioned a user to unban
    if (!args[0]) {
      return message.reply("Lütfen bir kullanıcı etiketleyin!");
    }

    // Get the user ID from the first argument (mention)
    const userId = args[0].replace(/[\\<>@!]/g, "");

    // Check if the user is valid
    if (isNaN(userId) || userId.length !== 18) {
      return message.reply("Geçersiz bir kullanıcı etiketlendi!");
    }

    try {
      // Unban the user
      await message.guild.members.unban(userId);

      // Create a success message
      const successEmbed = new EmbedBuilder()
      .setColor(0x2B2D31)
        .setDescription(`<a:kirmiziok:1208471148384354334> Kullanıcı başarıyla yasak kaldırıldı: <@${userId}>`);

      // Reply with the success message
      const replyMessage = await message.reply({ embeds: [successEmbed] });

      // Create a button to clear the success message
      const clearButton = new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Mesajı Temizle")
        .setCustomId("clear_button");

      // Create an action row with the clear button
      const actionRow = new ActionRowBuilder().addComponents(clearButton);

      // Edit the reply message to include the clear button
      await replyMessage.edit({ components: [actionRow] });

      // Create a filter to listen for button interactions
      const filter = (interaction) => interaction.customId === "clear_button" && interaction.user.id === message.author.id;

      // Create a collector to handle button interactions
      const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 }); // 60 seconds

      // Remove the success message when the clear button is clicked
      collector.on("collect", async (interaction) => {
        await interaction.update({ content: "Mesaj temizlendi.", components: [] });
      });

      // Remove the collector when it ends
      collector.on("end", () => {
        replyMessage.edit({ components: [] });
      });
    } catch (error) {
      console.error(error);
      message.reply("Yasak kaldırılırken bir hata oluştu!");
    }
  }
};
