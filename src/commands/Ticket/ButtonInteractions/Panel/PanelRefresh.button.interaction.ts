import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, ActionRowBuilder , ButtonBuilder, ButtonStyle, Interaction } from 'discord.js';
import { PanelTicketEnum, PanelTicketHandler } from '@src/structures/database/handler/panelTicket.handler.class';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelRefreshInteraction extends BaseInteraction {
    constructor() {
        super('ticketrefreshpanel', 'Refresh a ticket panel');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
        const message = interaction.message;

        if (interaction.message.embeds.length == 0) {
            await interaction.reply({ content: 'Something went wrong', ephemeral: true });
            return;
        }

        if (interaction.message.embeds[0].footer == null || interaction.message.embeds[0].footer.text == undefined) {
            await interaction.reply({ content: 'Something went wrong', ephemeral: true });
            return;
        }
        const panelTicket = await PanelTicketHandler.getPanelTicketById(interaction.message.embeds[0].footer.text);
        if (!panelTicket) {
            await interaction.reply({ content: `Couldn't find panel, so I'll delete it`, ephemeral: true });
            await interaction.message.delete();
            return;
        }

        if (client.user == null) {
            await interaction.reply({ content: 'Something went wrong', ephemeral: true });
            return;
        }

        const botUrl = client.user.avatarURL() || '';

        const embed = new EmbedBuilder()
            .setTitle(panelTicket.name)
            .setDescription(panelTicket.description)
            .setColor(Colors.Green)
            .setFooter({iconURL: botUrl, text: panelTicket.id })
    
        await interaction.deferUpdate();
        await interaction.message.edit({ embeds: [embed], components: message.components });
    }
}
