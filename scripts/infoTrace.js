"use strict";
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
exports.loadTracer = void 0;
var players_1 = require("./players");
var ranks_1 = require("./ranks");
function loadTracer() {
    var server = Vars.netServer;
    var allPlayers = Groups.player;
    Events.on(EventType.PlayerJoin, function (e) {
        var e_1, _a;
        var player = e.player;
        if (player.admin)
            return;
        var moderators = [];
        Groups.player.each(function (p) {
            if (players_1.FishPlayer.get(p).rank == ranks_1.Rank.mod)
                moderators.push(p);
        });
        try {
            for (var moderators_1 = __values(moderators), moderators_1_1 = moderators_1.next(); !moderators_1_1.done; moderators_1_1 = moderators_1.next()) {
                var moderator = moderators_1_1.value;
                trace(moderator, player);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (moderators_1_1 && !moderators_1_1.done && (_a = moderators_1.return)) _a.call(moderators_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.loadTracer = loadTracer;
function trace(player, target) {
    try {
        var target_info = target.info;
        var target_infos = Vars.netServer.admins.findByName(target_info.lastName);
        var target_name = "[#" + target.color + "]" + target.plainName() + "[]";
        var target_names = target_info.names.map(function (value, _index, _array) {
            return '"' + Strings.stripColors(value) + '"';
        }) + "";
        player.sendMessage("TRACE OF ".concat(target_name));
        player.sendMessage("".concat(target_info.timesKicked, " times kicked, ").concat(target_info.timesJoined, " times joined"));
        player.sendMessage("".concat(target_name, "'s names (no colors, sepeared by \",\", contained in double quotes): ").concat(target_names));
        player.sendMessage("".concat(target_name, " has changed ip addresses ").concat(target_info.ips.size - 1, " times (Keep in mind it could just be a dyn ip)"));
        if (target_infos.size > 0)
            player.sendMessage("They've changed uuid ".concat(target_infos.size - 1, " times (that screws up the trace, also it could just be their mobile account)"));
    }
    catch (e) {
        Log.err(e);
        if (player.admin)
            player.sendMessage(e);
    }
}
