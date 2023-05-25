"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.startIncrementingTheFrame = void 0;
var commands_1 = require("./commands");
var players_1 = require("./players");
var utils_1 = require("./utils");
var trails = [];
var frame = 1; //all that really matters is that it increases over time, not the value
var colorChangeSpeed = 1 / 500;
var colorPointer = 0;
var startIncrementingTheFrame = function () {
    Timer.schedule(function () {
        if (frame > 1280412032)
            frame = 0; //i dont want any problems with it becoming Infinity even though that's like... now that i think about it you probably would need years of uptime... whatever
        frame += 1 / 10;
    }, 0, 1 / 10);
};
exports.startIncrementingTheFrame = startIncrementingTheFrame;
exports.commands = {
    animtrail: {
        description: "A more advanced trail command",
        perm: commands_1.Perm.notGriefer,
        args: ["type:string?", "color:string?", "three_dimensions:boolean?"],
        handler: function (_a) {
            var sender = _a.sender, args = _a.args, output = _a.output, outputFail = _a.outputFail, outputSuccess = _a.outputSuccess;
            var extraDimensional = 1;
            if (args.three_dimensions) {
                extraDimensional = 1.5;
            }
            if (sender.trail != null) {
                sender.trail = null;
                output("Your trail has been reset");
                return;
            }
            if (args.type == undefined) {
                output("[yellow]\nTypes:\n1) squareSpiral\n2) spiral\n3) wannaBeSquareSpiral\n4) circle\n5) square\n[sky]\nExample usage: \n- /animtrail 1 #ffffff false\n- /animtrail wannaBeSquareSpiral pink false\nColor can be [color/r,g,b/#hex] \nThe 3d argument toggles 3d rotation (it's not real 3d of course)\n[grey]Suggestions go to frog\n                ");
                return;
            }
            var color;
            if (args.color != "rainbow") {
                color = args.color ? (0, utils_1.getColor)(args.color) : Color.green;
                if (!(color instanceof Color)) {
                    outputFail("That isn't a valid color\nA color can be [color/r,g,b/#hex]");
                    return;
                }
            }
            else {
                color = "rainbow";
                outputSuccess("don't tell anyone lmfao");
            }
            switch (args.type) {
                case "1":
                case "squareSpiral": {
                    sender.trail = {
                        type: "custom",
                        color: Color.white
                    };
                    renderTrail(sender.player, color, function (i) {
                        return new Vec2(Math.sin(i * Math.PI + frame) * i * 8, Math.cos(i * Math.PI + (frame / extraDimensional)) * i * 8);
                    }, 0.5);
                    break;
                }
                case "2":
                case "spiral": {
                    sender.trail = {
                        type: "custom",
                        color: Color.white
                    };
                    renderTrail(sender.player, color, function (i) {
                        return new Vec2(Math.sin(i + frame) * i * 7, Math.cos(i + (frame / extraDimensional)) * i * 7);
                    }, 0.5);
                    break;
                }
                case "3":
                case "wannaBeSquareSpiral": {
                    sender.trail = {
                        type: "custom",
                        color: Color.white
                    };
                    renderTrail(sender.player, color, function (i) {
                        return new Vec2(Math.sin(i * 2.9 + frame) * i * 8, Math.cos(i * 2.9 + (frame / extraDimensional)) * i * 8);
                    }, 0.5);
                    break;
                }
                case "4":
                case "circle": {
                    sender.trail = {
                        type: "custom",
                        color: Color.white
                    };
                    renderTrail(sender.player, color, function (i) {
                        return new Vec2(Math.sin(i + frame) * 10 * 8, Math.cos(i + (frame / extraDimensional)) * 10 * 8);
                    }, 1, 24);
                    break;
                }
                case "5":
                case "square": {
                    sender.trail = {
                        type: "custom",
                        color: Color.white
                    };
                    renderTrail(sender.player, color, function (i) {
                        return new Vec2(Math.sin(i * Math.PI + frame) * 10 * 8, Math.cos(i * Math.PI + (frame / extraDimensional)) * 10 * 8);
                    }, 0.5, 4);
                    break;
                }
                default: {
                    outputFail("Not a valid trail type");
                    break;
                }
            }
        }
    }
};
function renderTrail(player, color, math, detail, size) {
    if (size === void 0) { size = 10; }
    var start = new Vec2(0, 0);
    var end = new Vec2(0, 0);
    var playerP = new Vec2(0, 0);
    var task = Timer.schedule(function () {
        try {
            if (player == null) {
                Log.info("canceled because player was null");
                task.cancel();
            }
            if (players_1.FishPlayer.get(player).trail == null) {
                Log.info("cancelled because trail reset");
                task.cancel();
            }
            playerP = new Vec2(player.x, player.y);
            for (var i = 0; i < size; i += detail) {
                start.set(math(i - detail)).add(playerP);
                end.set(math(i)).add(playerP);
                var endColor = color;
                if (color == "rainbow") {
                    endColor = getRainbowAlready();
                }
                Call.effect(Fx.pointBeam, start.x, start.y, 0, endColor, end);
            }
        }
        catch (e) {
            Log.info(e);
            task.cancel();
        }
    }, 0, 1 / 10);
    trails.push(task);
    return task;
}
function getRainbow(i) {
    var colors = [Color.red, Color.orange, Color.yellow, Color.green, Color.blue, Color.purple, Color.pink, Color.pink, Color.red];
    if (colors.length < i + 1) {
        return Color.black;
    }
    var color = Math.floor(i);
    var firstColor = new Color(colors[color]);
    var secondColor = new Color(colors[color + 1]);
    firstColor.lerp(secondColor, i - color);
    return firstColor;
}
function getRainbowAlready() {
    colorPointer += colorChangeSpeed;
    var color = getRainbow(colorPointer);
    if (color == Color.black) {
        colorPointer = 0;
        color = getRainbow(colorPointer);
    }
    return color;
}
