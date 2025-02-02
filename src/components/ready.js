import { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import {emoji} from "../data/emoji.js";
import {matchTypes as types} from "../data/matchTypes.js";

export default async function ReadyEmbed({
    interaction, party, size, type_str, sessionId, expiry
}) {
    if (!expiry) {
        let now = new Date().getTime()
        expiry = Number(Math.floor(now / 1000)) + 60
    }
    let partyMembers = ""
    let content = "";
    await Promise.all(
        party.map(async v => {
            let playerId = v.playerId;
            if (v.status == 1) {
                content += `<@${String(playerId)}> `
                partyMembers += `\n :white_check_mark: [ ${emoji[v.role]} ] <@${String(playerId)}>`
            } else {
                partyMembers += `\n <a:loader:1089743842158329896> [ ${emoji[v.role]} ] <@${String(playerId)}> `
            }
        })
    )
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`ready:${sessionId}:${size}:${type_str}:${expiry}`)
                .setLabel('Ready')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`cancel:${sessionId}:${size}:${type_str}:${expiry}`)
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger),
        );

    const embed = new EmbedBuilder()
        .setTitle(`<:crossed_swords:1089748938334146560> Match Making <t:${expiry}:R>`)
        .addFields({ name: `<:family:1089750064735453205> ${size}v${size} ${types[type_str]} 매칭 성공!`, value: partyMembers })
        .setColor('Blue')
        .setTimestamp();




    return { embed, row, content }
}