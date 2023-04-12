import { BaseSlashCommand, BaseClient } from "@src/structures";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { SlashCommandOptionType } from "@src/structures";
import { PermissionFlagsBits } from "discord.js";

/**
 * @description Unmute slash command
 * @class Unmute
 * @extends BaseSlashCommand
 */
export class UnmuteSlashCommand extends BaseSlashCommand {
	constructor() {
		super('unmute', 'Unmute a member', [
            {
                name: 'member',
                description: 'The member to unmute',
                required: true,
                type: SlashCommandOptionType.USER
            },
            {
                name: 'reason',
                description: 'The reason for the unmute',
                required: false,
                type: SlashCommandOptionType.STRING
            }
        ], 0, true, [PermissionFlagsBits.MuteMembers]);
	}

	/**
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const memberOption = interaction.options.get('member')

        if (!memberOption) {
            await interaction.reply('Something went wrong!');
            return;
        };
        
        const member = memberOption.member;

        if (!member || !interaction.guild) {
            await interaction.reply('Something went wrong!');
            return;
        };

        if (!(member instanceof GuildMember)) {
            await interaction.reply('Something went wrong!');
            return;
        };

        const role = interaction.guild.roles.cache.find(r => r.name === 'Muted');

        if (!role) {
            await interaction.reply('Something went wrong!');
            return;
        };

        if (!member.roles.cache.has(role.id)) {
            await interaction.reply('This member is not muted!');
            return;
        };

        await member.roles.remove(role);
        await interaction.reply(`Successfully unmuted ${member}`);

	}
}
