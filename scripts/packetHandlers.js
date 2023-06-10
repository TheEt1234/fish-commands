"use strict";
/**
 * contributed by frogo
 * the code style was AAAAAAAAAAAA, see 59bf37bc10cc13a9c1f294ca8d91b0a99be41e62 -BalaM314
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPacketHandlers = exports.lastAccessedLines = void 0;
// hey frog here
// thanks balam, i removed things that i thought were useless
// i renamed bulkLineEffect to lines
// it's the only packet handler i thought wasn't that useless and was like actually cool 
// this should probably be renamed to "lines" in the future
var players_1 = require("./players");
var vector = new Vec2(0, 0); //done so that i dont have to create a new vector each time
exports.lastAccessedLines = {}; //i think the cool kids call this a memory leak or something
function loadPacketHandlers() {
    Vars.netServer.addPacketHandler("lines", function (player, content) {
        var e_1, _a;
        var fishP = players_1.FishPlayer.get(player);
        if (!fishP.hasPerm("play"))
            return;
        try {
            var parts = content.split('|');
            if (!fishP.hasPerm("bulkLabelPacket") && parts.length > 10) {
                player.kick("Non admins can only have a bulk line of 10 parts", 0);
                return;
            }
            if (parts.length >= 1000) {
                player.kick("Too much trolling", 0);
                return;
            }
            try {
                for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                    var effectData = parts_1_1.value;
                    var parts_of_part = effectData.split(",");
                    Call.effect(Fx.pointBeam, Number(parts_of_part[0]), Number(parts_of_part[1]), 0, Color.valueOf(parts_of_part[4]), vector.set(Number(parts_of_part[2]), Number(parts_of_part[3])));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!exports.lastAccessedLines[player.id]) {
                players_1.FishPlayer.messageStaff("lines", "[grey]" + player.plainName() + " is using packet handlers");
            }
            exports.lastAccessedLines[player.id] = true;
        }
        catch (e) {
            player.kick("Error while trying to process your lines: (most likely something with color, just use the full hex code)\n" + e, 0);
        }
    });
}
exports.loadPacketHandlers = loadPacketHandlers;
