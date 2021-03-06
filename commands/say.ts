import Discord, {
    Client,
    Message,
    TextChannel
} from "discord.js";
import {
    getSetting
} from "../index";
import {
    error_red
} from "../config"
import {
    log_yellow
} from "../config"
import {
    version
} from '../package.json'


export let name = 'say';
export let description = 'Says a message!';
export let usage = '[channel] [message]';
export let guildOnly = true

export async function execute(client: Client, message: Message, args: string[]) {
    const on = await getSetting("say") === "on";
    if (!on) {
        const notOn = new Discord.MessageEmbed();
        notOn
            .setTitle(message.author.tag)
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setColor(error_red)
            .addField("I'm Not On!", 'This command it turned off! Please ask a mod or admin to turn it back on!')
            .setFooter(version)
            .setTimestamp()
        return await message.channel.send(notOn);
    }
    const mentionedChannel = message.mentions.channels.first() || client.channels.cache.get(args[0]) as TextChannel;
    const mod = message.member.hasPermission("MANAGE_ROLES") || (message.author.id === "660238973943152707")
    if (!mod) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle('Missing Permissions')
            .setColor(error_red)
            .addField('Missing Perms!', `Hey ${message.author}, you are missing permissions to use this command.`)
            .setFooter(version)
            .setTimestamp()
        return message.channel.send(embed);
    }
    if (!mentionedChannel) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle('Invalid Channel!')
            .setColor('F90B0B')
            .addField('Whats that?', 'That\'s not a channel!')
            .setFooter(version)
            .setTimestamp()
        return message.channel.send(embed);
    }
    if (mentionedChannel && !args[1]) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle('Error!')
            .setColor(error_red)
            .addField('I think you forgot something', 'Your forgot what you wanted to say! Think deeper')
            .setFooter(version)
            .setTimestamp()
        return message.channel.send(embed);
    }
    const messages1 = args.slice(1).join(' ');
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle('Say Cmd Log')
        .setColor(log_yellow)
        .addField('This person used the command!:', `<@${message.author.id}>`)
        .addField('The message was:', messages1)
        .setFooter(version)
        .setTimestamp()
    const chl = client.channels.cache.get('668987003517534259') as TextChannel;
    await chl.send(embed);
    return await mentionedChannel.send(messages1);
}