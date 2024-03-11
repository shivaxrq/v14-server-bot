const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "hata",
    description: "SAKINA SAKIN OWNERS KISMINA DOKUNMA ANNANI SİKERLER VALLA",
    permissions: ["SendMessages"]
  },
  run: async (client, message, args, prefix) => {
    // Define owner ID directly
    const OWNERS = ["1185163404609073173"]; 

    // Check if the message author is an owner
    if (!OWNERS.includes(message.author.id)) return;

    // Get the owner user
    const owner = await client.users.fetch(OWNERS[0]); // Assuming there is only one owner

    // Get the server invite
    const invite = await message.channel.createInvite({ unique: true });

    // Send DM to the owner
    try {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Hata Raporu")
        .setDescription(`Merhaba ${owner.username}, altyapı kullanırken bir hata aldın. Yardımcı olabilir miyim?\nSunucu Davet Linki: ${invite.url}`);

      owner.send({ embeds: [embed] });
      message.reply("Hata raporu altyapı sahibine başarıyla gönderildi.");
    } catch (error) {
      console.error(error);
      message.reply("Hata raporu gönderirken bir sorun oluştu. Bot sahibinin DM'leri kapalı olabilir.");
    }
  }
};