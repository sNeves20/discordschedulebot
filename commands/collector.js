module.exports = {
    messageColector: ({message}) => {
        message.reply("Enter your username");

        const filter = (msg) => {
            return msg.auth.id === message.auth.id;
        }

        const collector = message.channel.createMessageCollector({
            filter,
            max: 1,
            time: 1000 * 5

        })

        collector.on("collect", message => {
            console.log(message.constructo(content)) 
        })

        collector.on("end", collected => {
            if(collected.size === 0) {
                message.reply("You did not provide your username");
                return;
            }

            let text = "Collected:\n\n";

            collected.forEach((msg) => {
                text += `${message.content}\n`
            }) 
        })
    }
}