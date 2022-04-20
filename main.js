require('dotenv').config(); // initialize dotenv

// Discord bot setup
const Discord = require('discord.js');
const bot = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
    ]
});

function return_text(text){

    if (text === "schedule"){
        return "This is working";
    }
    else {
        return "This is also working";
    }
}

bot.on('ready', ()=>{
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', async (msg) => {
    const botWasMentioned = msg.content.startsWith("!schedule")

    console.log(botWasMentioned);

    if (botWasMentioned) {
        try {
            await msg.channel.createMessage('Present');
        } catch (err) {
            // There are various reasons why sending a message may fail.
            // The API might time out or choke and return a 5xx status,
            // or the bot may not have permission to send the
            // message (403 status).
            console.warn('Failed to respond to mention.');
            console.warn(err);
        }
    }
 });

 bot.on('error', err => {
     console.warn(err);
 });


bot.login(process.env.DISCORD_TOKEN); //login bot using token
