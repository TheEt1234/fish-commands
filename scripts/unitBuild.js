"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUnitBuild = void 0;
var players_1 = require("./players");
var ranks_1 = require("./ranks");
var procs = {
    "400": true,
    "401": true,
    "402": true, //hyperProcessor
};
var ActionType = Packages.mindustry.net.Administration.ActionType;
var validateUnitBuild = function () {
    Vars.netServer.admins.addActionFilter(function (action) {
        if (action.type == ActionType.configure) { // UPDATE: does NOT fire on logic build
            var player_1 = action.player;
            var tile_1 = action.tile;
            Core.app.post(function () {
                //explenation: the config gives you bytes, which i can't figure out how to convert to a string, so i just use this scuffed method of getting the future tile
                try {
                    validateProcessor(tile_1, player_1);
                }
                catch (e) { }
            });
            return true;
        }
        return true;
    });
    Events.on(EventType.BlockBuildEndEvent, function (e) {
        try {
            var breaking = e.breaking, tile = e.tile, unit = e.unit;
            var block = tile.block();
            if (breaking)
                return;
            //@ts-ignore
            if (!procs[block.id])
                return;
            if (!unit.isPlayer()) {
                setNetAir(tile);
                return;
            }
            validateProcessor(tile, unit.player);
        }
        catch (e) {
            Log.info(e);
        }
    });
};
exports.validateUnitBuild = validateUnitBuild;
function validateProcessor(tile, originalPlayer) {
    var fishPlayer = players_1.FishPlayer.get(originalPlayer);
    var code = tile.build.code;
    var includesBuild = code.includes("ucontrol build");
    if (includesBuild && !fishPlayer.ranksAtLeast(ranks_1.Rank.trusted)) {
        originalPlayer.sendMessage("Hey hey, you're trying to place logic which contains unit build, you need to gain trusted to do that");
        setNetAir(tile);
    }
}
function setNetAir(tile) {
    Core.app.post(function () { tile.setNet(Blocks.air); });
}
