require('dotenv').config(); // initialize dotenv
const calendar = require('./commands/calender.js');
const cron = require('node-cron');

async function showPossibleSchedule(commandArray){
    let dayOfWeek = commandArray[0];
    let amountOfDays = commandArray[1];

    if(!(dayOfWeek in calendar.weekDays)){

        throw "Invalid day of the week inserted";
    }
    let possibleDays = (await calendar.getNextAvailableDates(calender.weekDays[dayOfWeek], amountOfDays));
    
    let response = "Select one of the following days:\n";
    for(i = 0; i < possibleDays.length; i++){
        response +=`> ${i+1 } - ${possibleDays[i]}\n`;
    }

    console.log(response)
    return response;
}

// Discord bot setup
const Discord = require('discord.js');
const calender = require('./commands/calender.js');
const bot = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGE_REACTIONS"
    ]
});

// Initiate bot
bot.on('ready', () => {

    const channel = bot.channels.cache.get('966004233931481149'); // Announcement Channel ID
    console.log(`Logged in as ${bot.user.tag}!`);
});

// Check for message
bot.on('messageCreate', async (msg) => {

    // Ignoring if the message author is the bot
    if (msg.author.bot) return;

    // Checking if the bot is being commanded
    const botWasMentioned = msg.content.startsWith("!schedule");

    if (botWasMentioned) {
        let command = msg.content.split(" ");
        switch (command[1]){
            case "day":
                console.log("\t Working on day command")
                showPossibleSchedule(command.slice(2)).then((response) => {
                    msg.reply(response);
                });
                break;
            case "lock":
                console.log("\tLocking Data");

            default:
                msg.reply("The command you inserted is not supported.");
                break;
        }
    }
 });

bot.on('error', err => {
     console.warn(err);
 });


bot.login(process.env.DISCORD_TOKEN); //login bot using token
