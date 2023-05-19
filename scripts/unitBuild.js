"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUnitBuild = void 0;
var players_1 = require("./players");
var ranks_1 = require("./ranks");
var ActionType = Packages.mindustry.net.Administration.ActionType;
var validateUnitBuild = function () {
    Vars.netServer.admins.addActionFilter(function (action) {
        if (action.type == ActionType.configure) { //fires on logic build too
            var player_1 = action.player;
            var tile_1 = action.tile;
            Core.app.post(function () {
                //explenation: the config gives you bullshit bytes, which i can't figure out how to convert to a string, so i just use this scuffed method of getting the future tile
                try {
                    validateProcessor(tile_1, player_1);
                }
                catch (e) { }
            });
            return true;
        }
        return true;
    });
};
exports.validateUnitBuild = validateUnitBuild;
function validateProcessor(tile, originalPlayer) {
    var fishPlayer = players_1.FishPlayer.get(originalPlayer);
    var code = tile.build.code;
    var includesBuild = code.includes("ucontrol build");
    if (includesBuild && !fishPlayer.ranksAtLeast(ranks_1.Rank.trusted)) {
        originalPlayer.sendMessage("Hey hey, you're trying to place logic which contains unit build, you need to gain trusted to do that");
        tile.setNet(Blocks.air);
    }
}
