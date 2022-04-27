import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
//import {insertEvent, getNextAvailableDates} from './modules/scheduler';

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES

    ]
})

client.on('ready', () =>{
    console.log('The bot is ready')

    const guildId = '965923963739971595'
    const guild = client.guilds.cache.get(guildId)
    let commands

    if (guild){
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: "ping",
        description:'Replies with pong',
    })

    commands?.create({
        name: "schedule-request",
        description: "Requests a list possible days to schedule an event",
        options: [
            {
                name: "weekday",
                description: "Day of the week we want to schedule",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            },
           {
               name: "timeframe",
               description: "Timeframe to schedule on (example: 30 days)",
               required: true,
               type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
           }
        ]
    })
})

client.on('interactionCreate', async (interaction) => {

    console.log("Hello World");

    if(!interaction.isCommand()){
        console.log("the fuck?")
        return
    }

    const {commandName, options} = interaction

    if(commandName === "ping"){
        interaction.reply({
            content: "pong",
            ephemeral: true,
        })
    } else if(commandName === "schedule-request"){

        let weekday = options.getString('weekday')
        const timeFrame = options.getNumber('timeframe')
        if(weekday === null || timeFrame === null){
            interaction.reply({
                content: "Please make sure **weekday** and **timeFrame** are correctly\
                specified",
                ephemeral: true
            })
        }

        // let message = await getNextAvailableDates(weekday, timeFrame).then((availableDays) => {
        //         let msg = "Vote for one of the following days:\n"
        //         for(let i = 0; i < availableDays.length; i++){
        //             msg += "> 1. " + availableDays[i]
        //         }
        //         return msg
        //     })

        let message = "Toma pila no cu"

        interaction.reply({
            content: message,
            ephemeral: false,
        })
    }
})

function getPossibleDays(weekday: any, timeFrame: any) {

    if (weekday === "saturday" && timeFrame === 30){
        return "The possible days are:\n\
        > 2022-02-12";
    } else {
        return null;
    }
    
}
client.login(process.env.DISCORD_TOKEN)