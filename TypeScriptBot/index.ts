import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import {insertEvent, getNextAvailableDates} from './modules/scheduler';

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

    if(!interaction.isCommand()){
        return
    }

    const {commandName, options} = interaction

    if(commandName === "ping"){
        interaction.reply({
            content: "pong",
            ephemeral: true,
        })
    } else if(commandName === "check-day"){

        let weekday = options.getString('weekday')
        const timeFrame = options.getNumber('timeframe')
        if(weekday === null || timeFrame === null){
            interaction.reply({
                content: "Please make sure **weekday** and **timeFrame** are correctly\
                specified",
                ephemeral: true
            })
        }

        let message = await getNextAvailableDates(weekday, timeFrame).then((availableDays) => {
                let msg = "Vote for one of the following days:\n"
                for(let i = 0; i < availableDays.length; i++){
                    msg += `> ${i+1}. ${availableDays[i]} \n`
                }
                return msg
            })

        interaction.reply({
            content: message,
            ephemeral: false,
        })
    }
})


client.login(process.env.DISCORD_TOKEN)