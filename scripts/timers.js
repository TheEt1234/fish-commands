"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTimers = void 0;
var players_1 = require("./players");
var api_1 = require("./api");
var config = require("./config");
function initializeTimers() {
    //Autosave
    Timer.schedule(function () {
        var file = Vars.saveDirectory.child('1' + '.' + Vars.saveExtension);
        Core.app.post(function () {
            SaveIO.save(file);
            players_1.FishPlayer.saveAll();
            Call.sendMessage('[#4fff8f9f]Game saved.');
        });
    }, 10, 300);
    //Trails
    Timer.schedule(function () { return players_1.FishPlayer.forEachPlayer(function (p) { return p.displayTrail(); }); }, 5, 0.15);
    //Staff chat
<<<<<<< HEAD
    if (!config.localDebug)
        Timer.schedule(function () {
            (0, api_1.getStaffMessages)(function (messages) {
                if (messages.length)
                    players_1.FishPlayer.messageStaff(messages);
            });
        }, 5, 3);
=======
    Timer.schedule(function () {
        (0, api_1.getStaffMessages)(function (messages) {
            if (!messages.length)
                return;
            players_1.FishPlayer.messageStaff(messages);
        });
    }, 5, 3);
    //Replacing blacklisting with a kick 
    //because blacklisting causes problems for administration
    Timer.schedule(function () {
        try {
            var blacklist_1 = Vars.netServer.admins.dosBlacklist;
            var admins_1 = Vars.netServer.admins;
            if (blacklist_1.isEmpty())
                return;
            blacklist_1.forEach(function (b) {
                var ips = admins_1.findByIPs(b);
                admins_1.handleKicked(ips.get(ips.size - 1), b, 60 * 1000);
                Log.info("Unblacklisted, but kicked for one minute this fella: " + b);
                blacklist_1.remove(b);
            });
        }
        catch (e) {
            Log.info(e);
        }
    }, 3.15, 2);
>>>>>>> 7674a8e (Replaced blacklisting with kicking)
}
exports.initializeTimers = initializeTimers;
