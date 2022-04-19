require('dotenv').config(); // initialize dotenv

// Discord bot setup
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
    ]
});

client.on('ready', ()=>{
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if(msg.content === "schedule"){
        await mark_stuff_gc().then( response =>{
                console.log(response);
                msg.reply(response);
            }
        );
    }
});


// Google Calendar Setup
const { google } = require('googleapis');
const { REPL_MODE_SLOPPY } = require('repl');
const cal = google.calendar({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY,
});

// set calendar to query
const calendar = "discordscheduler@gmail.com";


async function mark_stuff_gc(){
    const day = new Date()
    // Set beginning of query to 3 pm tomorrow
    const tomorrow3pm = new Date();
    tomorrow3pm.setDate(day.getDate() + 1);
    tomorrow3pm.setHours(15, 0, 0);

    // Set end of query to 4 pm tomorrow
    const tomorrow4pm = new Date();
    tomorrow4pm.setDate(day.getDate() + 1);
    tomorrow4pm.setHours(16, 0, 0)

    // Make the query
    cal.freebusy.query({
        resource: {
            // Set time to ISO strings as such
            timeMin: new Date(tomorrow3pm).toISOString(),
            timeMax: new Date(tomorrow4pm).toISOString(),
            timeZone: 'NZ',
            items: [{ id: calendar }],
            }
    }).then((result) =>{
            const busy = result.data.calendars[calendar].busy;
            const errors = result.data.calendars[calendar].errors;
            if (busy.length !== 0) {
                console.log("\tBusy!\n");
                    return "Busy";
        }
        console.log("\tFree!\n");
        return "Free";
            }).catch(e => {
                console.error(e);
            });
}


client.login(process.env.DISCORD_TOKEN); //login bot using token
