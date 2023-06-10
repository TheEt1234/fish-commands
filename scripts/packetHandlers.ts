/**
 * contributed by frogo
 * the code style was AAAAAAAAAAAA, see 59bf37bc10cc13a9c1f294ca8d91b0a99be41e62 -BalaM314
 */

// hey frog here
// thanks balam, i removed things that i thought were useless
// i renamed bulkLineEffect to lines
// it's the only packet handler i thought wasn't that useless and was like actually cool 
// this should probably be renamed to "lines" in the future

import { FishPlayer } from "./players";

let vector: Vec2 = new Vec2(0, 0) //done so that i dont have to create a new vector each time

export let lastAccessedLines: any = {} //i think the cool kids call this a memory leak or something

export function loadPacketHandlers() {
	Vars.netServer.addPacketHandler("lines", (player: mindustryPlayer, content: string) => {
		const fishP = FishPlayer.get(player);
		if (!fishP.hasPerm("play")) return;
		try {
			const parts = content.split('|');
			if (!fishP.hasPerm("bulkLabelPacket") && parts.length > 10) {
				player.kick("Non admins can only have a bulk line of 10 parts", 0);
				return;
			}
			if (parts.length >= 1000) {
				player.kick("Too much trolling", 0);
				return;
			}
			for (const effectData of parts) {
				const parts_of_part = effectData.split(",");
				Call.effect(
					Fx.pointBeam, Number(parts_of_part[0]), Number(parts_of_part[1]),
					0, Color.valueOf(parts_of_part[4]),
					vector.set(Number(parts_of_part[2]), Number(parts_of_part[3]))
				);
			}
			if (!lastAccessedLines[player.id]) {
				FishPlayer.messageStaff("lines", "[grey]" + player.plainName() + " is using packet handlers")
			}

			lastAccessedLines[player.id] = true


		} catch (e) {
			player.kick("Error while trying to process your lines: (most likely something with color, just use the full hex code)\n" + e, 0);
		}
	});

}

