require('dotenv').config(); // initialize dotenv

// Discord bot setup
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
});


// Sending message with bot
client.on('message', msg =>{
    if (msg.content === "ping"){
        msg.reply("Pong!");
    }
});

client.on('ready', ()=>{
    console.log(`Logged in as ${client.user.tag}!`);
});


client.login(process.env.TOKEN); //login bot using token
