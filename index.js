import Discord from 'discord.js';
 
const client = new Discord.Client()

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const TEXT_MATCHERS = {
    FuckNiko: new RegExp("fuck niko", "gi"),
};

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("Pong!")

  } else if (TEXT_MATCHERS.FuckNiko.test(msg.content)) {
    msg.reply("Fuck you :)")
  }
})

client.login("NzE1NzI3MTgyNzkzODAxNzI5.XtBbMg.ATXy16YnidlqkM5CrIkjJPCBz0s")