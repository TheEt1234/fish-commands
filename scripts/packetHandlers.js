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
<<<<<<< HEAD
    Vars.netServer.addPacketHandler("label", function (player, content) {
        try {
            var fishP = players_1.FishPlayer.get(player);
            if (!fishP.hasPerm("play"))
                return;
            var parts = content.split(',');
            if (parts.length != 4) {
                player.kick("An error has occured while trying to process your label request:\nImproperly formatted content, correct format: text,duration,x,y\nExample: \"E,10,Vars.player.x,Vars.player.y\"\nIf duration is larger than 10 it will be set to 3\nif text length is above 41 you will be kicked", 0);
            }
            else if (parts[0].length > 41) {
                player.kick("ok that's a lot of characters, 41 is the limit here", 0);
                return;
            }
            else {
                var duration = Number(parts[1]) <= 10 ? Number(parts[1]) : 3;
                Call.label(parts[0], duration, Number(parts[2]), Number(parts[3]));
                lastAccessedLabel = fishP;
                lastLabelText = parts[0];
            }
        }
        catch (e) {
            player.kick("An error has occured while trying to process your label request:\n" + e, 0);
        }
    });
    Vars.netServer.addPacketHandler("bulkLabel", function (player, content) {
        var e_1, _a;
        var fishP = players_1.FishPlayer.get(player);
        if (!fishP.hasPerm("bulkLabelPacket")) {
            player.kick("Not an admin or a moderator, cannot access BulkLabel", 0);
            return;
        }
        try {
            var parts = content.split('|');
            if (parts.length > 1000) {
                player.kick("Hey man that's a... i get you're an admin or a moderator but... that's too much labels", 0);
                return;
            }
            try {
                for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                    var labelData = parts_1_1.value;
                    var parts_of_part = labelData.split(",");
                    Call.labelReliable(parts_of_part[0], Number(parts_of_part[1]), Number(parts_of_part[2]), Number(parts_of_part[3]));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            lastAccessedBulkLabel = fishP;
        }
        catch (e) {
            player.kick("An error has occured while trying to process your label request:\n" + e, 0);
        }
    });
    Vars.netServer.addPacketHandler("lineEffect", function (player, content) {
        var fishP = players_1.FishPlayer.get(player);
        if (!fishP.hasPerm("play"))
            return;
        try {
            var parts = content.split(',');
            if (parts.length != 5) {
                player.kick("An error has occured while trying to process your lineEffect request: invalid format: format is origin_x,origin_y,end_x,end_y,color\nexample: [5,5,100,100,Color.green].join(\",\")", 0);
                return;
            }
            Call.effect(Fx.pointBeam, Number(parts[0]), Number(parts[1]), 0, Color.valueOf(parts[4]), new Vec2(Number(parts[2]), Number(parts[3])));
            lastAccessedLine = fishP;
        }
        catch (e) {
            player.kick("An error has occured while trying to process your lineEffect request:\n" + e, 0);
        }
    }); // this is the silas effect
    Vars.netServer.addPacketHandler("bulkLineEffect", function (player, content) {
        var e_2, _a;
        var fishP = players_1.FishPlayer.get(player);
        if (!fishP.hasPerm("play"))
=======
    Vars.netServer.addPacketHandler("lines", function (player, content) {
        var e_1, _a;
        var fishP = players_1.FishPlayer.get(player);
        if (fishP.stopped)
>>>>>>> 0f1d443 (Polished up fork)
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
